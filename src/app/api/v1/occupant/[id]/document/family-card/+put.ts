import { db } from "@/server/db"
import { OccupantDocument, TInsertOccupantDocument } from "@/server/db/schema"
import { getCurrentOccupant, throwFailed, useAuth } from "@/server/security/auth"
import { deleteFile, uploadFile } from "@/server/storage"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq, and, desc } from "drizzle-orm"

export const config = {
  api: {
    bodyParser: false,
  },
}

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    })

    const occupant = await getCurrentOccupant(req)

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file || file.size === 0) {
      return sendErrors(400, { message: "Silahkan unggah file kartu keluarga" });
    }

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
      return sendErrors(404, { message: "File Kartu keluarga tidak ditemukan" })
    }

    if (occupant.id != occupantDocument.occupantId) {
      throwFailed()
    }

    const oldStorage = occupantDocument.storage

    const storage = await uploadFile(file as File)

    const updatedDocument: Partial<TInsertOccupantDocument> = {
      storageId: storage.id,
    }
    
    await db().update(OccupantDocument)
      .set(updatedDocument)
      .where(eq(OccupantDocument.id, occupantDocument.id))

    if (oldStorage) {
      try {
        await deleteFile(oldStorage)
      } catch (error) {
        return sendErrors(500, { message: "Gagal Menghapus File Sebelumnya" })
      }
    }

    return sendData(200, { message: "File Kartu Keluarga Berhasil Diubah" })
  }
)
