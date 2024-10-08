import { db } from "@/server/db"
import { toCashflowResponse } from "@/server/models/responses/cashflow"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"

export const GET = defineHandler(async (req) => {
  useAuth(req)
  const cashflows = await db().query.Cashflow.findMany()
  return sendData(200, cashflows.map(toCashflowResponse))
})
