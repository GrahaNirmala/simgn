import { db } from "@/server/db"
import { Cashflow } from "@/server/db/schema"
import { toCashflowResponse } from "@/server/models/responses/cashflow"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  amount: z.number(),
  movement: z.enum(["income", "outcome"]),
  description: z.string().optional().nullable(),
  title: z.string(),
})

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    })

    let cashflow = await db().query.Cashflow.findFirst({
      where: eq(Cashflow.id, params.id),
    })
    if (!cashflow) return sendErrors(404, "Cashflow not found" as any)

    return sendData(200, toCashflowResponse(cashflow))
  },
)
