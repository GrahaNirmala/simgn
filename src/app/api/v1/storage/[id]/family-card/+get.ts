import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Occupant, OccupantDocument } from "@/server/db/schema"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { and, desc, eq } from "drizzle-orm"


export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
      occupant: true,
    })

    const occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, params.id),
    })
    if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

    const occupantDocuments = await db().query.OccupantDocument.findMany({
      with: {
        storage: true,
      },
      where: and(
        eq(OccupantDocument.occupantId, params.id),
        eq(OccupantDocument.type, "family_card"),
      ),
      orderBy: desc(OccupantDocument.id),
    })

    const data = occupantDocuments
      .map(doc => ({ storageId: doc.storage?.id }))
      .filter(item => item.storageId);
      
    return sendData(200, data)
  },
)
