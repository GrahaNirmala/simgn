import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { House, Occupant, TInsertOccupant } from "@/server/db/schema"
import { toOccupantResponse } from "@/server/models/responses/occupant"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { hashPassword } from "@/server/security/password"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  role: z.enum(["owner", "renter"]),
  house_id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string(),
  password: z.string().min(8),
})

export const POST = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin", "secretary"],
  })
  const staff = await getCurrentStaff(req)
  const param = await bindJson(req, Param)

  const isHouseExists = await db().query.House.findFirst({
    where: eq(House.id, param.house_id),
  })
  if (!isHouseExists) return sendErrors(404, errorDefinition.house_not_found)

  //
  const isHouseTaken = await db().query.Occupant.findFirst({
    where: and(
      eq(Occupant.houseId, param.house_id),
      eq(Occupant.role, param.role),
    ),
  })
  if (isHouseTaken) return sendErrors(409, errorDefinition.house_taken)

  if (param.email) {
    let occupantExists = await db().query.Occupant.findFirst({
      where: eq(Occupant.email, param.email),
    })
    if (occupantExists) return sendErrors(409, errorDefinition.email_registered)
  }

  let occupantExists = await db().query.Occupant.findFirst({
    where: eq(Occupant.phone, param.phone),
  })
  if (occupantExists) return sendErrors(409, errorDefinition.phone_registered)

  const occupant: TInsertOccupant = {
    role: param.role,
    houseId: param.house_id,
    name: param.name,
    email: param.email,
    phone: param.phone,
    password: await hashPassword(param.password),

  }

  const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

  await logActivity(
    staff.id ,
    "Penghuni",
    "Menambahkan",
    `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menambahkan penghuni dengan nama ${param.name}`,
  )

  let [newOccupant] = await db().insert(Occupant).values(occupant).returning()
  return sendData(201, toOccupantResponse(newOccupant))
})
