import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Occupant } from "@/server/db/schema"
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
    let occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, params.id),
    })
    if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found)
    
    await db().delete(Occupant).where(eq(Occupant.id, params.id))
    
    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;
    
      await logActivity(
      staff.id ,
      "Penghuni",
      "Menghapus",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menghapus data penghuni dengan nama ${occupant.name}`,
    )  

    return sendNoContent()
  },
)
