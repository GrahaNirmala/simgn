import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Billing, House } from "@/server/db/schema"
import { toBillingResponse } from "@/server/models/responses/billing"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { and, eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req)

    const house = await db().query.House.findFirst({
      where: eq(House.id, params.id),
    })
    if (!house) return sendErrors(404, errorDefinition.house_not_found)

    const billings = await db().query.Billing.findMany({
      where: and(eq(Billing.houseId, house.id), eq(Billing.isPaid, false)),
    })

    if (!billings) return sendErrors(404, errorDefinition.billing_not_found)

    return sendData(200, billings.map(toBillingResponse))
  },
)
