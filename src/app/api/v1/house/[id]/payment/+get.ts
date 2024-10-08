import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Billing, House, Payment, TPayment } from "@/server/db/schema"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { and, desc, eq, inArray, ne } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req)

    const house = await db().query.House.findFirst({
      where: eq(House.id, params.id),
    })
    if (!house) return sendErrors(404, errorDefinition.house_not_found)

    const billings = await db().query.Billing.findMany({
      where: eq(Billing.houseId, house.id),
    })
    if (!billings || billings.length <= 0) {
      return sendData(200, [])
    }

    const payments: TPayment[] = await db().query.Payment.findMany({
      where: and(
        inArray(
          Payment.billingId,
          billings.map((billing) => billing.id),
        ),
        ne(Payment.status, "pending"),
      ),
      orderBy: desc(Payment.createdAt),
    })

    return sendData(200, payments)
  },
)
