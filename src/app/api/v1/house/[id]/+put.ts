import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { House } from "@/server/db/schema"
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

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })

    const staff = await getCurrentStaff(req)
    let param = await bindJson(req, Param)

    let house = await db().query.House.findFirst({
      where: eq(House.id, params.id),
    })
    if (!house) return sendErrors(404, errorDefinition.house_not_found)

    house.code = param.code
    house.address = param.address
    house.updatedAt = new Date()

    await db().update(House).set(house).where(eq(House.id, params.id))

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id ,
      "Rumah",
      "Mengubah",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Mengubah Rumah dengan code ${param.code}`,
    )
    
    return sendData(200, toHouseResponse(house))
  },
)
