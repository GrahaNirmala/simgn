import { db } from "@/server/db"
import { OccupantDocument, Storage, TInsertOccupantDocument } from "@/server/db/schema"
import { useAuth } from "@/server/security/auth"
import { uploadFile } from "@/server/storage"
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
    await db().delete(OccupantDocument).where(eq(OccupantDocument.id, occupantDocument.id))

    await db().delete(Storage).where(eq(Storage.id, occupantDocument.storageId))

    return sendData(200, { message: "Family card updated successfully" })
  }
)
