import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Occupant } from "@/server/db/schema"
import { toOccupantResponse } from "@/server/models/responses/occupant"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
      occupant: true,
    })

    const occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, params.id),
    })
    if (!occupant) sendErrors(404, errorDefinition.occupant_not_found)

    return sendData(200, toOccupantResponse(occupant))
  },
)
