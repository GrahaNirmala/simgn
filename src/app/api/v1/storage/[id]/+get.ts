import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Announcement, Storage } from "@/server/db/schema"
import { toStorageResponse } from "@/server/models/responses/storage"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })

    const announcement = await db().query.Announcement.findFirst({
      where: eq(Announcement.id, params.id),
    })

    if (!announcement) {
      return sendErrors(404, errorDefinition.announcement_not_found)
    }

    if (!announcement.storageId) {
      return sendData(200, null)
    }

    const storage = await db().query.Storage.findFirst({
      where: eq(Storage.id, announcement.storageId),
    })

    if (!storage) {
      return sendData(200, null)
    }

    return sendData(200, toStorageResponse(storage))
  }
)
