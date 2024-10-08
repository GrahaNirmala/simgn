import { db } from "@/server/db";
import { Billing, Payment, TInsertPayment } from "@/server/db/schema";
import { generateOrderId, snap } from "@/server/providers/midtrans";
import { getCurrentOccupant, useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { format } from "date-fns";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";

const Param = z.object({
  ids: z.array(z.number())
});

export const POST = defineHandler(async (req) => {
  useAuth(req, {
    occupant: true,
  });  
  const param = await bindJson(req, Param);
  const occupant = await getCurrentOccupant(req);
  const now = new Date();
  const order_id = generateOrderId();
  const newPayments = [];
  let totalBillingAmount = 0;
  const itemDetails = [];


  for (const id of param.ids) {
    const billing = await db().query.Billing.findFirst({
      where: eq(Billing.id, id),
    });  
    if (!billing) {
      return sendErrors(404, { message: `Billing with ID ${id} not found` });
    }  
    if (billing.isPaid) {
      return sendErrors(423, { message: `Billing with ID ${id} already paid` });
    }  
    const billingAmount = billing.amount + (billing.extraCharge ?? 0);
    
    totalBillingAmount += billingAmount;
    
    const itemName = `Tagihan ${new Date(
      billing.period,
    ).toLocaleString("id-ID", {
      month: "long",
    })} ${new Date(billing.period).getFullYear()}`;
    
    itemDetails.push({
      id: billing.id.toString(),
      price: billingAmount,
      quantity: 1,
      name: itemName,
    });  

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
  }  
  const expiredAt = new Date(now.getTime() + 15 * 60 * 1000);  

  const parameter = {
    transaction_details: {
      order_id: order_id,
      gross_amount: totalBillingAmount,
    },
    customer_details: {
      first_name: occupant.name,
      email: occupant.email,
      phone: occupant.phone,
    },
    item_details: itemDetails,
    enabled_payments: ["credit_card", "bank_transfer", "gopay", "shopeepay", "other_qris", "bri_va", "bca_va", "other_qris", "other_va", "bca_klikbca", "bca_klikpay"],
    expiry: {
      start_time: format(now, "yyyy-MM-dd HH:mm:ss +0700"),
      unit: "minutes",
      duration: 435,
    },
  };  
  const res = await snap().createTransaction(parameter);  

  for (const id of param.ids) {
    const billing = await db().query.Billing.findFirst({
      where: eq(Billing.id, id),
    });  
    if (!billing) {
      return sendErrors(404, { message: "Billing not found" });
    }  
    const totalBilling = billing.amount + (billing.extraCharge ?? 0);  
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
    newPayments.push(newPayment);
  }  
  return sendData(200, newPayments);
});
