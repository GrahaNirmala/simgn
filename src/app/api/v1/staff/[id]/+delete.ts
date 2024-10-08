import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Staff } from "@/server/db/schema"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { sendErrors, sendNoContent } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const DELETE = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })
    const staffs = await getCurrentStaff(req)
    let staff = await db().query.Staff.findFirst({
      where: eq(Staff.id, params.id),
    })
    if (!staff) return sendErrors(404, errorDefinition.staff_not_found)

    await db().delete(Staff).where(eq(Staff.id, params.id))

    const formattedRole = staffs.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staffs.id,
      "Pengurus",
      "Menghapus",
      `Pengurus dengan nama ${staffs.name} dengan Role ${formattedRole} Menghapus pengurus dengan nama ${staff.name}`,
    )

    return sendNoContent()
  },
)
