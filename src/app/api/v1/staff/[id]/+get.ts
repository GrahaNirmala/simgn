import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Staff } from "@/server/db/schema"
import { toStaffResponse } from "@/server/models/responses/staff"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })
    let staff = await db().query.Staff.findFirst({
      where: eq(Staff.id, params.id),
    })
    if (!staff) return sendErrors(404, errorDefinition.staff_not_found)

    return sendData(200, toStaffResponse(staff))
  },
)
