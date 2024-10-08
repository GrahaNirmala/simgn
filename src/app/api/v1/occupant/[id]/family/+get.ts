import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Family, Occupant } from "@/server/db/schema"
import { toFamilyResponse } from "@/server/models/responses/family"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req)

    const occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, params.id),
    })
    if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

    const families = await db().query.Family.findMany({
      where: eq(Family.occupantId, params.id),
    })

    return sendData(
      200,
      families.map((family) => toFamilyResponse(family)),
    )
  },
)
