import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { BillingConfig } from "@/server/db/schema"
import { toBillingConfigResponse } from "@/server/models/responses/billing-config"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    })
    let billingConfig = await db().query.BillingConfig.findFirst({
      where: eq(BillingConfig.id, params.id),
    })
    if (!billingConfig) sendErrors(404, errorDefinition.billing_not_found)

    return sendData(200, toBillingConfigResponse(billingConfig))
  },
)