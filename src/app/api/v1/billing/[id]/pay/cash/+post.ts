import { db } from "@/server/db"
import { Billing, DeviceToken, House, Payment, TInsertPayment } from "@/server/db/schema"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { admin } from "@/server/security/firebase";
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { numberFormat } from "@/lib/utils"
import { logActivity } from "@/server/utils/logging"

type DeviceTokenType = {
  device_token: string | null; 
};


const Param = z.object({
  occupant_id: z.number().nonnegative(),
})

export const POST = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    })
    const staff = await getCurrentStaff(req)
    const param = await bindJson(req, Param)

    let billing = await db().query.Billing.findFirst({
      where: eq(Billing.id, params.id),
    })

    if (!billing) return sendErrors(404, { message: "Billing not found" })

    if (billing.isPaid) {
      return sendErrors(423, { message: "Billing already paid" })
    }

    let house = await db().query.House.findFirst({
      where: eq(House.id, billing.houseId),
    })
    
    const extraCharge = billing.extraCharge ?? 0
    const totalBilling = billing.amount + extraCharge

    const payment: TInsertPayment = {
      billingId: billing.id,
      amount: totalBilling,
      payerId: param.occupant_id,
      status: "settlement",
      mode: "cash",
      tanggalBilling: billing.period,
    }

    const [newPayment] = await db().insert(Payment).values(payment).returning()
    billing.isPaid = true
    await db().update(Billing).set(billing).where(eq(Billing.id, billing.id))
    
    const deviceTokens = await db()
    .select({ device_token: DeviceToken.deviceToken })
    .from(DeviceToken)
    .where(eq(DeviceToken.occupantId, param.occupant_id))
    .execute() as DeviceTokenType[];

    const validTokens = deviceTokens.map((token) => token.device_token).filter((token): token is string => token !== null);

    const billingDate = new Date(billing.period);
    const month = billingDate.toLocaleString('id-ID', { month: 'long' });
    const year = billingDate.getFullYear();

    const message = {
      notification: {
        title: "Tagihan Sudah Terbayar",
        body: `Tagihan Anda untuk bulan ${month} ${year} sebesar ${numberFormat(billing.amount)} sudah terbayarkan.`,
      },
      tokens: validTokens,
    };

    await admin.messaging().sendEachForMulticast(message);

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;
      
    await logActivity(
      staff.id,
      "Data Penghuni",
      "Export",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Melakukan Export Data Penghuni Perumahan`
    );
    
    return sendData(200, newPayment)
  },
)
