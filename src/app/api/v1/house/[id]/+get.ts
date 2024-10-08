import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { House, Occupant } from "@/server/db/schema"
import {
  HouseResponse,
  HouseResponseWithFamilyCard,
  toHouseResponse,
} from "@/server/models/responses/house"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { and, eq } from "drizzle-orm"

export const GET = defineHandler(
  async (_, { params }: { params: { id: number } }) => {
    let house = await db().query.House.findFirst({
      where: eq(House.id, params.id),
    })
    if (!house) return sendErrors(404, errorDefinition.house_not_found)

    const owner = await db().query.Occupant.findFirst({
      where: and(eq(Occupant.houseId, params.id), eq(Occupant.role, "owner")),
      with: {
        occupantDocument: true,
      },
    })

    const renter = await db().query.Occupant.findFirst({
      where: and(eq(Occupant.houseId, params.id), eq(Occupant.role, "renter")),
      with: {
        occupantDocument: true,
      },
    })

    const response: HouseResponseWithFamilyCard = {
      ...toHouseResponse(house, {
        owner: owner,
        renter: renter,
      })!,
      is_owner_family_card_uploaded: !!owner?.occupantDocument,
      is_renter_family_card_uploaded: !!renter?.occupantDocument,
    }

    return sendData(200, response)
  },
)
