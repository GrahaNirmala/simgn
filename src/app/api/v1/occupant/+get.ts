import { db } from "@/server/db"
import {
  GetAllOccupantsResponse,
  OccupantResponse,
  toOccupantResponse,
} from "@/server/models/responses/occupant"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"

export const GET = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin", "secretary"],
  })

  let occupants = await db().query.Occupant.findMany({
    with: {
      occupantDocument: true,
    },
  })

  const responses = occupants.map<GetAllOccupantsResponse>((occupant) => {
    return {
      ...toOccupantResponse(occupant)!,
      is_family_card_uploaded: !!occupant.occupantDocument,
    }
  })

  return sendData(200, responses)
})
