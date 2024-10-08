import { db } from "@/server/db"
import { LogActivity } from "@/server/db/schema"
import { toLogActivityResponse } from "@/server/models/responses/log-activity"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"
import { gte } from "drizzle-orm"

export const GET = defineHandler(async (req) => {
  useAuth(req, {
    staff: ["admin"],
  })

  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  
  const staffs = await db().query.LogActivity.findMany({
    where: gte(LogActivity.createdAt, threeMonthsAgo),
    with: {
        author: true,
      },
  })
  return sendData(
    200,
    staffs.map((staff) =>
      toLogActivityResponse(staff, {
        author: staff.author,
      }),
    ),
  )
})
