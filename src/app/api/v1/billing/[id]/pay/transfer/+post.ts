import { db } from "@/server/db";
import { Billing, Payment, TInsertPayment } from "@/server/db/schema";
import { generateOrderId, snap } from "@/server/providers/midtrans";
import { getCurrentOccupant, useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";
import { format } from "date-fns";
import { and, eq, gte, sql } from "drizzle-orm";

export const POST = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    });

    const order_id = generateOrderId();

    const occupant = await getCurrentOccupant(req);

    const billing = await db().query.Billing.findFirst({
      where: eq(Billing.id, params.id),
    });

    if (!billing) {
      return sendErrors(404, { message: "Billing not found" });
    }
    if (billing.isPaid) {
      return sendErrors(423, { message: "Billing already paid" });
    }
    
    const totalBilling = billing.amount + (billing.extraCharge ?? 0);

    const pendingPayment = await db().query.Payment.findFirst({
      where: and(
        eq(Payment.billingId, billing.id),
        eq(Payment.status, "pending"),
        gte(Payment.expiredAt, sql`now()`),
      ),
    });

    if (pendingPayment) {
      return sendData(200, pendingPayment);
    }

    const now = new Date();
    const expiredAt = new Date(now.getTime() + 15  * 60 * 1000);

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: totalBilling,
      },
      customer_details: {
        first_name: occupant.name,
        email: occupant.email,
        phone: occupant.phone,
      },
      enabled_payments: ["credit_card", "bank_transfer", "gopay", "other_qris", "bri_va", "bca_va", "other_qris", "other_va", "bca_klikbca", "bca_klikpay"],
      callbacks: {},
      expiry: {
        start_time: format(now, "yyyy-MM-dd HH:mm:ss +0700"),
        unit: "minutes",
        duration: 135,
      },
    };

    const res = await snap().createTransaction(parameter);
    
    const payment: TInsertPayment = {
      billingId: billing.id,
      amount: totalBilling,
      payerId: occupant.id,
      invoice: order_id,
      token: res.token,
      status: "pending",
      tanggalBilling: billing.period,
      mode: "transfer",
      expiredAt: expiredAt,
      redirectUrl: res.redirect_url,
    };

    const [newPayment] = await db().insert(Payment).values(payment).returning();
    
    return sendData(200, newPayment);
  },
);
