import { TFamily } from "@/server/db/schema"

export type FamilyResponse = {
  id: number
  occupant_id: number
  name: string
  identity_number: string
  birthday: Date
  gender: string
  birthplace: string
  religion: string
  job_type: string | null
  marital_status: string
  relationship_status: string
  created_at: Date
  updated_at: Date | null
}

export function toFamilyResponse(family?: TFamily): FamilyResponse | null {
  return family
    ? {
        id: family.id,
        occupant_id: family.occupantId,
        name: family.name,
        identity_number: family.identityNumber,
        birthday: family.birthday,
        gender: family.gender,
        birthplace: family.birthplace,
        religion: family.religion,
        job_type: family.job_type,
        marital_status: family.maritalStatus,
        relationship_status: family.relationshipStatus,
        created_at: family.createdAt,
        updated_at: family.updatedAt,
      }
    : null
}
