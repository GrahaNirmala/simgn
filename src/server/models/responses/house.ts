import { THouse, TOccupant } from "../../db/schema"
import { OccupantResponse, toOccupantResponse } from "./occupant"

export type HouseResponse = {
  id: number
  code: string
  address: string
  created_at: Date
  updated_at: Date | null
  owner: OccupantResponse | null
  renter: OccupantResponse | null
}

export type HouseResponseWithFamilyCard = HouseResponse & {
  is_owner_family_card_uploaded: boolean
  is_renter_family_card_uploaded: boolean
}

export function toHouseResponse(
  house?: THouse,
  relations?: {
    owner?: TOccupant
    renter?: TOccupant
  },
): HouseResponse | null {
  return house
    ? {
        id: house.id,
        code: house.code,
        address: house.address,
        created_at: house.createdAt,
        updated_at: house.updatedAt,
        owner: toOccupantResponse(relations?.owner),
        renter: toOccupantResponse(relations?.renter),
      }
    : null
}
