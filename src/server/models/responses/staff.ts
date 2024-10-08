import { TStaff } from "../../db/schema"

export type StaffResponse = {
  id: number
  name: string
  role: string
  email: string | null
  phone: string
  created_at: Date
  updated_at: Date | null
}

export function toStaffResponse(staff?: TStaff): StaffResponse | null {
  return staff
    ? {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        email: staff.email,
        phone: staff.phone,
        created_at: staff.createdAt,
        updated_at: staff.updatedAt,
      }
    : null
}
