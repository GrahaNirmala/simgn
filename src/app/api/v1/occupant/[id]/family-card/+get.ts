import { errorDefinition } from "@/lib/constants";
import { getCurrentOccupant, throwFailed, useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    });

    const occupant = await getCurrentOccupant(req);

    if (!occupant) {
      return sendErrors(404, errorDefinition.occupant_not_found);
    }
    
    if (occupant.id !== params.id) {
      throwFailed();
    }

    return sendData(200, {
      familyCard: occupant.familyCard, 
    });
  }
);
