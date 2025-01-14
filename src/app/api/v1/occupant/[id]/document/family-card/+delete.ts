import { db } from "@/server/db"
import { OccupantDocument, Storage, TStorage } from "@/server/db/schema"
import { getCurrentOccupant, throwFailed, useAuth } from "@/server/security/auth"
import { deleteFile } from "@/server/storage"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq, and, desc } from "drizzle-orm"

export const config = {
  api: {
    bodyParser: false,
  },
}

export const DELETE = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    })
    
    const occupant = await getCurrentOccupant(req)

    const occupantDocument = await db().query.OccupantDocument.findFirst({
      with: {
        storage: true,
      },
      where: and(
        eq(OccupantDocument.storageId, params.id),
        eq(OccupantDocument.type, "family_card"),
      ),
      orderBy: desc(OccupantDocument.id),
    })

    if (!occupantDocument) {
      return sendErrors(404, { message: "File kartu keluarga tidak ditemukan" })
    }

    if (occupant.id != occupantDocument.occupantId) {
      throwFailed()
    }

    const { storage } = occupantDocument

    if (storage) {
      try {
        await deleteFile(storage as TStorage)
      } catch (error) {
        return sendErrors(500, { message: "Gagal Menghapus File Sebelumnya" })
      }
    }
    await db().delete(OccupantDocument).where(eq(OccupantDocument.id, occupantDocument.id))

    await db().delete(Storage).where(eq(Storage.id, occupantDocument.storageId))

    return sendData(200, { message: "File Kartu Keluarga Berhasil Dihapus" })
  }
)
