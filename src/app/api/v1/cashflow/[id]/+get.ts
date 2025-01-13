import { db } from "@/server/db"
import { Cashflow } from "@/server/db/schema"
import { toCashflowResponse } from "@/server/models/responses/cashflow"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
      occupant: true,
    })

    let cashflow = await db().query.Cashflow.findFirst({
      where: eq(Cashflow.id, params.id),
    })
    if (!cashflow) return sendErrors(404, "Cashflow not found" as any)

    return sendData(200, toCashflowResponse(cashflow))
  },
)
