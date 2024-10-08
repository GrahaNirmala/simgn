import { db } from "@/server/db"
import { OccupantDocument, TInsertOccupantDocument } from "@/server/db/schema"
import { getCurrentOccupant, throwUnauthorized, useAuth } from "@/server/security/auth"
import { uploadFile } from "@/server/storage"
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

    const formData = await req.formData()
    const file = formData.get("file")
    if (!file) return sendErrors(400, { message: "Please upload file" })

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
      return sendErrors(404, { message: "Family card document not found" })
    }

    const storage = await uploadFile(file as File)

    const updatedDocument: Partial<TInsertOccupantDocument> = {
      storageId: storage.id,
    }

    await db().update(OccupantDocument)
      .set(updatedDocument)
      .where(eq(OccupantDocument.id, occupantDocument.id))

    return sendData(200, { message: "Family card updated successfully" })
  }
)
