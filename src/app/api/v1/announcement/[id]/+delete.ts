import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Announcement } from "@/server/db/schema"
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
    let announcement = await db().query.Announcement.findFirst({
      where: eq(Announcement.id, params.id),
    })

    if (!announcement)
      return sendErrors(404, errorDefinition.announcement_not_found)
    
    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;
        
    await logActivity(
      staff.id,
      "Pengumuman",
      "Menghapus",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menghapus pengumuman dengan judul ${announcement.title}`,
    )

    await db().delete(Announcement).where(eq(Announcement.id, params.id))

    return sendNoContent()
  },
)
