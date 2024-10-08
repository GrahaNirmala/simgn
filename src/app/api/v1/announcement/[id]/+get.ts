import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Announcement } from "@/server/db/schema"
import { toAnnouncementResponse } from "@/server/models/responses/announcement"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })

    let announcement = await db().query.Announcement.findFirst({
      where: eq(Announcement.id, params.id),
    })
    if (!announcement)
      return sendErrors(404, errorDefinition.announcement_not_found)

    return sendData(200, toAnnouncementResponse(announcement))
  },
)
