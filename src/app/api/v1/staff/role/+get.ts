import { db } from "@/server/db"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"
import { sql } from "drizzle-orm"

type Response = string[]

export const GET = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin", "secretary"],
  })

  const roles = await db().execute(
    sql`SELECT unnest(enum_range(NULL::staff_role)) AS staff_role`,
  )
  const response: Response = roles.map((r) => r.staff_role as string)

  return sendData(200, response)
})
