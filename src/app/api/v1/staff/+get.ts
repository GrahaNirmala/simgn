import { db } from "@/server/db"
import { toStaffResponse } from "@/server/models/responses/staff"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"

export const GET = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin", "secretary"],
  })

  const staffs = await db().query.Staff.findMany()
  return sendData(200, staffs.map(toStaffResponse))
})
