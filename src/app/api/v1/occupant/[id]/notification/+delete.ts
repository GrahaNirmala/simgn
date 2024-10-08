import { defineHandler } from '@/server/web/handler';
import { db } from '@/server/db';
import { useAuth } from "@/server/security/auth";
import { DeviceToken } from '@/server/db/schema';
import { eq } from "drizzle-orm";
import { sendData, sendErrors } from '@/server/web/response';
import { errorDefinition } from '@/lib/constants';

type DeleteResponse = {
  message: string
}

export const DELETE = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      occupant: true,
    });

    const deviceToken = await db().query.DeviceToken.findFirst({
      where: eq(DeviceToken.id, params.id),
    });

    if (!deviceToken) {
      return sendErrors(404, errorDefinition.occupant_not_found_auth);
    }

    await db().delete(DeviceToken).where(eq(DeviceToken.id, params.id));

    const response: DeleteResponse = {
      message: "Device token deleted successfully",
    };
    return sendData(200, response);
  },
);
