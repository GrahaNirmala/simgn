import { errorDefinition } from "@/lib/constants";
import { numberFormat } from "@/lib/utils";
import { db } from "@/server/db";
import { BillingConfig } from "@/server/db/schema";
import { toBillingConfigResponse } from "@/server/models/responses/billing-config";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { logActivity } from "@/server/utils/logging";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import * as z from "zod";

const Param = z.object({
  amountBill: z.number(),
  extraChargeBill: z.number(),
})

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    });
    const staff = await getCurrentStaff(req)
    const param = await bindJson(req, Param);


    let billingConfig = await db().query.BillingConfig.findFirst({
      where: eq(BillingConfig.id, params.id),
    })

    if (!billingConfig) {
        console.error("Billing configuration not found for ID:", params.id);
      return sendErrors(404, errorDefinition.billing_not_found);
    }

    billingConfig.amountBill = param.amountBill
    billingConfig.extraChargeBill = param.extraChargeBill


    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id,
      "Pengaturan Billing",
      "Mengubah",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} mengubah pengaturan billing menjadi Tagihan bulanan = ${numberFormat(param.amountBill)}, Denda = ${numberFormat(param.extraChargeBill)}`,
    )

    await db().update(BillingConfig).set(billingConfig).where(eq(BillingConfig.id, params.id));

    return sendData(200, toBillingConfigResponse(billingConfig));
  },
)
