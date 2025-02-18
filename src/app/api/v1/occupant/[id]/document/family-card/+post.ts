import { db } from "@/server/db"
import { OccupantDocument, TInsertOccupantDocument } from "@/server/db/schema"
import {
  getCurrentOccupant,
  throwFailed,
  useAuth,
} from "@/server/security/auth"
import { uploadFile } from "@/server/storage"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"

export const config = {
  api: {
    bodyParser: false,
  },
}

export const POST = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    })

    const occupant = await getCurrentOccupant(req)
    if (occupant.id != params.id) {
      throwFailed()
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file || file.size === 0) {
      return sendErrors(400, { message: "Silahkan unggah file kartu keluarga" });
    }

    const storage = await uploadFile(file as File)
    const occupantDocument: TInsertOccupantDocument = {
      type: "family_card",
      occupantId: occupant.id,
      storageId: storage.id,
    }

    await db().insert(OccupantDocument).values(occupantDocument)
    return sendData(200, { message: "Kartu Keluarga Berhasil ditambahkan" })
  },
)
