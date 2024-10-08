import { db } from "@/server/db";
import { Billing, DeviceToken, Payment } from "@/server/db/schema";
import { snap } from "@/server/providers/midtrans";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { numberFormat } from "@/lib/utils";
import { admin } from "@/server/security/firebase";

const Param = z.object({
  order_id: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
  payment_type: z.string().optional(),
});

type DeviceTokenType = {
  device_token: string | null; 
};

const sendNotification = async (message: any) => {
  await admin.messaging().sendEachForMulticast(message);
};

const sendPaymentSuccessNotification = async (updatedPayment: any, payment_method: any) => {
  const deviceTokens = await db()
    .select({ device_token: DeviceToken.deviceToken })
    .from(DeviceToken)
    .where(eq(DeviceToken.occupantId, updatedPayment.payerId))
    .execute() as DeviceTokenType[];

  const validTokens = deviceTokens.map((token) => token.device_token).filter((token): token is string => token !== null);

  const billingDate = new Date(updatedPayment.tanggalBilling);
  const month = billingDate.toLocaleString('id-ID', { month: 'long' });
  const year = billingDate.getFullYear();

  const message = {
    notification: {
      title: "Tagihan Sudah Terbayar",
      body: `Tagihan Anda untuk bulan ${month} ${year} sebesar ${numberFormat(updatedPayment.amount)} sudah terbayarkan menggunakan ${payment_method}`,
    },
    tokens: validTokens,
  };

  await sendNotification(message);
};

export const POST = defineHandler(async (req) => {
  const param = await bindJson(req, Param);

  let payments = await db().query.Payment.findMany({
    where: eq(Payment.invoice, param.order_id),
  });
  if (!payments) {
    return sendErrors(404, { message: "Payment not found" });
  }

  const res = await snap().transaction.status(param.order_id);

  const updatedPayments = [];
  for (const payment of payments) {
    payment.status = res.transaction_status;
    payment.mode = param.payment_type ?? "Transfer";

    const [updatedPayment] = await db()
      .update(Payment)
      .set(payment)
      .where(eq(Payment.id, payment.id))
      .returning();

    updatedPayments.push(updatedPayment);

    // If the payment is successful, mark the associated billing as paid
    if (updatedPayment.status === "settlement") {
      await db()
        .update(Billing)
        .set({ isPaid: true })
        .where(eq(Billing.id, updatedPayment.billingId));

      // Send notification for each successful payment
      await sendPaymentSuccessNotification(updatedPayment, param.payment_type);
    }
  }

  return sendData(200, updatedPayments);
});
