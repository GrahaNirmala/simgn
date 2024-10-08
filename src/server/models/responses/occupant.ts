import { DataFamilyCard, TOccupant } from "@/server/db/schema"

export type OccupantResponse = {
  id: number
  name: string
  role: string
  created_at: Date
  updated_at: Date | null
  house_id: number
  email: string | null
  phone: string
  familyCard:  DataFamilyCard | null
}

export type GetAllOccupantsResponse = OccupantResponse & {
  is_family_card_uploaded: boolean
}

export function toOccupantResponse(
  occupant?: TOccupant,
): OccupantResponse | null {
  return occupant
    ? {
        id: occupant.id,
        role: occupant.role,
        name: occupant.name,
        house_id: occupant.houseId,
        email: occupant.email,
        phone: occupant.phone,
        created_at: occupant.createdAt,
        updated_at: occupant.updatedAt,
        familyCard: occupant.familyCard,
      }
    : null
}
