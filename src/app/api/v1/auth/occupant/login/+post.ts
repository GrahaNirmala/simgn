import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Occupant } from "@/server/db/schema"
import {
  OccupantResponse,
  toOccupantResponse,
} from "@/server/models/responses/occupant"
import { comparePassword } from "@/server/security/password"
import { generateToken, generateRefreshToken } from "@/server/security/token"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  phone: z.string(),
  password: z.string(),
})

type Response = {
  token: string
  refreshToken: string
  occupant: OccupantResponse
}

export const POST = defineHandler(async (req) => {
  const param = await bindJson(req, Param)
  const occupant = await db().query.Occupant.findFirst({
    where: eq(Occupant.phone, param.phone),
  })
  if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found_auth)

  let isCorrectPassword = await comparePassword(
    param.password,
    occupant.password,
  )
  if (!isCorrectPassword)
    return sendErrors(401, errorDefinition.password_incorrect)

  let token = generateToken({
    sub: occupant.id.toString(),
    role: occupant.role,
    roleType: "occupant",
  })

  let refreshToken = generateRefreshToken({
    sub: occupant.id.toString(),
    role: occupant.role,
    roleType: "occupant",
  })

  const response: Response = {
    token: token,
    refreshToken: refreshToken,
    occupant: toOccupantResponse(occupant)!,
  }

  const data = sendData(200, response)
  data.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 2,
  })
  data.cookies.set({
    name: "refreshtoken",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax", 
  })
  data.cookies.set("houseId", occupant.houseId.toString())
  return data
})
