import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { House } from "@/server/db/schema"
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
    const staff = await getCurrentStaff(req)
    let house = await db().query.House.findFirst({
      where: eq(House.id, params.id),
    })
    if (!house) return sendErrors(404, errorDefinition.house_not_found)

    await db().delete(House).where(eq(House.id, params.id))

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id ,
      "Rumah",
      "Menghapus",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menghapus Rumah dengan code ${house.code}`,
    )
    
    return sendNoContent()
  },
)
