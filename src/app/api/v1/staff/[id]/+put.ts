import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Staff } from "@/server/db/schema"
import { toStaffResponse } from "@/server/models/responses/staff"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  role: z.enum(["admin", "secretary", "treasurer", "security_guard"]),
})

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })
    const staffs = await getCurrentStaff(req)
    const param = await bindJson(req, Param)

    if (param.email) {
      let staffExists = await db().query.Staff.findFirst({
        where: eq(Staff.email, param.email),
      })
    }

    let staffExists = await db().query.Staff.findFirst({
      where: eq(Staff.phone, param.phone),
    })

    let staff = await db().query.Staff.findFirst({
      where: eq(Staff.id, params.id),
    })
    if (!staff) return sendErrors(404, errorDefinition.staff_not_found)

    staff.name = param.name
    staff.email = param.email ?? null
    staff.phone = param.phone
    staff.role = param.role
    staff.updatedAt = new Date()

    await db().update(Staff).set(staff).where(eq(Staff.id, params.id))

    const formattedRole = staffs.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staffs.id,
      "Pengurus",
      "Mengubah",
      `Pengurus dengan nama ${staffs.name} dengan Role ${formattedRole} Mengubah pengurus dengan nama ${staff.name}`,
    )
    
    return sendData(201, toStaffResponse(staff))
  },
)
