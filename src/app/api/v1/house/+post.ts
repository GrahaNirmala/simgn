import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { House, TInsertHouse } from "@/server/db/schema"
import { toHouseResponse } from "@/server/models/responses/house"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { z } from "zod"

const Param = z.object({
  code: z.string(),
  address: z.string(),
})

export const POST = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin", "secretary"],
  })

  const staff = await getCurrentStaff(req)
  const param = await bindJson(req, Param)

  let houseExist = await db().query.House.findFirst({
    where: eq(House.code, param.code),
  })
  if (houseExist) return sendErrors(409, errorDefinition.house_code_registered)

  let house: TInsertHouse = {
    code: param.code,
    address: param.address,
  }

  let [newHouse] = await db().insert(House).values(house).returning()

  const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;
      
  await logActivity(
    staff.id ,
    "Rumah",
    "Menambah",
    `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menambah Rumah dengan code ${param.code}`,
  )

  return sendData(201, toHouseResponse(newHouse))
})
