import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Occupant } from "@/server/db/schema";
import { getCurrentOccupant, throwFailed, useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm"
import { z } from "zod";

const Param = z.object({
  noFamilyCard: z.string(),
  nameHeadFamily: z.string(),
  addressCard: z.string(),
  rtRwCard: z.string(),
  desaCard: z.string(),
  kecamatanCard: z.string(),
  kabupatenCard: z.string(),
  posCodeCard: z.string(),
  provinsiCard: z.string(),
})

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {staff: ["admin", "secretary"],
    occupant: true,
  })
  const param = await bindJson(req, Param)

  const occupant = await getCurrentOccupant(req)
    if (occupant.id != params.id) {
      throwFailed()
    }

  if(!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

  await db().update(Occupant)
  .set({familyCard: param})
  .where(eq(Occupant.id, params.id))
  .returning();
  
  return sendData(200, {
    message: "Family card updated successfully.",
    familyCard: param,
  });
})
