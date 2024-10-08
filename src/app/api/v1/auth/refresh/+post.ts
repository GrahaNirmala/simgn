import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";
import { verifyToken, generateToken } from "@/server/security/token";
import { z } from "zod";
import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Occupant } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { bindJson } from "@/server/web/request";
import { config } from '@/server/config';

const RefreshParam = z.object({
  token: z.string(),
});

type RefreshResponse = {
  token: string;
};

export const POST = defineHandler(async (req) => {
    
  const param = await bindJson(req, RefreshParam);
  try {
    const decoded = verifyToken(param.token, config.jwt.refresh);

    if (!decoded) {
      return sendErrors(403, errorDefinition.invalid_refresh_token);
    }

    const occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, parseInt(decoded.sub)),
    });

    if (!occupant) {
      return sendErrors(404, errorDefinition.occupant_not_found_auth);
    }

    const newAccessToken = generateToken({
      sub: occupant.id.toString(),
      role: occupant.role,
      roleType: "occupant",
    });

    const response: RefreshResponse = {
      token: newAccessToken,
    };

    const data = sendData(200, response);
    data.cookies.set({
      name: "token",
      value: newAccessToken,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 2,
    });
    return data;
  } catch (err) {
    return sendErrors(403, errorDefinition.invalid_refresh_token);
  }
});
