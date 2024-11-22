import { db } from '@/server/db';
import { getCurrentOccupant, throwFailed, useAuth } from "@/server/security/auth";
import { DeviceToken, TInsertDeviceToken } from '@/server/db/schema';
import { defineHandler } from '@/server/web/handler';
import { z } from 'zod';
import { bindJson } from '@/server/web/request';
import { sendData, sendErrors } from '@/server/web/response';
import { errorDefinition } from '@/lib/constants';

// Define the schema for parameter validation
const Param = z.object({
  device_token: z.string(),
});

type Response = {
  id: Number
}

export const POST = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
  
    useAuth(req, {
      occupant: true,
    });

    
    const param = await bindJson(req, Param);

    const occupant = await getCurrentOccupant(req)
    if (occupant.id != params.id) {
      throwFailed()
    }

    if (!occupant) {
      return sendErrors(404, errorDefinition.occupant_not_found_auth);
    }

    const deviceToken: TInsertDeviceToken = {
      occupantId: occupant.id,
      deviceToken: param.device_token,
    }
    
    const insertedDeviceToken = await db()
      .insert(DeviceToken)
      .values(deviceToken)
      .returning({ id: DeviceToken.id });
      const response: Response = {
        id: insertedDeviceToken[0].id,
      };
    return sendData(200, response);
  },
);
