import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Staff } from "@/server/db/schema"
import { StaffResponse, toStaffResponse } from "@/server/models/responses/staff"
import { comparePassword } from "@/server/security/password"
import { generateToken } from "@/server/security/token"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  phone: z.string(),
  password: z.string(),
})

type Response = {
  token: string
  staff: StaffResponse
}

export const POST = defineHandler(async (req) => {
  const param = await bindJson(req, Param)
  let staff = await db().query.Staff.findFirst({
    where: eq(Staff.phone, param.phone),
  })
  if (!staff) return sendErrors(404, errorDefinition.phone_not_registered)

  let isCorrectPassword = await comparePassword(param.password, staff.password)
  if (!isCorrectPassword)
    return sendErrors(401, errorDefinition.password_incorrect)

  let token = generateToken({
    sub: staff.id.toString(),
    role: staff.role,
    roleType: "staff",
  })

  const response: Response = {
    token: token,
    staff: toStaffResponse(staff)!,
  }

  const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

  await logActivity(
    staff.id ,
    "Login",
    "Auth",
    `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Melakukan Login`,
  )

  const data = sendData(200, response)
  data.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 2,
  })
  return data
})
