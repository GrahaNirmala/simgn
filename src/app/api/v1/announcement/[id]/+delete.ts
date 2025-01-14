import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Announcement, Storage } from "@/server/db/schema"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { deleteFile } from "@/server/storage"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors, sendNoContent } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const DELETE = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })
    const staff = await getCurrentStaff(req)
    const announcement = await db().query.Announcement.findFirst({
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
    
    if(announcement.storageId){
      const storage = await db().query.Storage.findFirst({
        where: eq(Storage.id, announcement.storageId)
      })
      if(storage){
        try {
          await deleteFile(storage)
        } catch (error) {
          return sendErrors(500, {
            message: "Gagal menghapus file",
          })
        }
        await db().delete(Storage).where(eq(Storage.id, storage.id))
      }
    }

    await db().delete(Announcement).where(eq(Announcement.id, params.id))

    return sendData(200, { message: "Pengumuman berhasil dihapus" })
  }
)
