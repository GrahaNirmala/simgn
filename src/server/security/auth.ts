import { eq } from "drizzle-orm"
import { db } from "../db"
import { ApiError } from "../models/exceptions/api"
import { getToken, verifyToken } from "./token"
import { Occupant, Staff } from "../db/schema"
import { NextRequest } from "next/server"
import { config } from '@/server/config';

const claimSubHeader = "x-claim-sub"

export type RoleType = "staff" | "occupant"

export type StaffRole = "admin" | "secretary" | "treasurer" | "security_guard"
export type OccupantRole = "owner" | "renter"

export type Role = StaffRole | OccupantRole

export function useAuth(
  req: NextRequest,
  allowedRoles?: {
    staff?: StaffRole[] | true
    occupant?: OccupantRole[] | true
  },
) {
  const { sub, role_type, role } = verifyToken(getToken(req), config.jwt.secret)
  req.headers.set(claimSubHeader, sub)
  if (!allowedRoles) return{ role_type };

  const allowedClaimRoles = allowedRoles[role_type];
  if (allowedClaimRoles === true) return { role_type };

  for (const allowedClaimRole of allowedClaimRoles ?? []) {
    if (role === allowedClaimRole) return { role_type };
  }

  throwUnauthorized()
}

export function throwUnauthorized(): never {
  throw new ApiError(401, "Unauthorized")
}

export async function getCurrentStaff(req: Request) {
  const sub = req.headers.get(claimSubHeader)
  if (!sub) throwUnauthorized()

  const staff = await db().query.Staff.findFirst({
    where: eq(Staff.id, parseInt(sub)),
  })
  if (!staff) throwUnauthorized()

  return staff
}

export async function getCurrentOccupant(req: Request) {
  const sub = req.headers.get(claimSubHeader)
  if (!sub) throwUnauthorized()

  const occupant = await db().query.Occupant.findFirst({
    where: eq(Occupant.id, parseInt(sub)),
  })
  if (!occupant) throwUnauthorized()

  return occupant
}
