import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Occupant } from "@/server/db/schema";
import { comparePassword, hashPassword } from "@/server/security/password";
import { defineHandler } from "@/server/web/handler";
import { getCurrentOccupant, useAuth } from "@/server/security/auth"
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import { z } from "zod";

const Param = z.object({
    id: z.number(),
    password: z.string(),
    newPassword: z.string(),
})

type Response = {
    message: string
}

export const PUT = defineHandler(async(req) => {
    useAuth(req, {
        occupant: true,
      })
    const param = await bindJson(req, Param)
    const occupant = await getCurrentOccupant(req)
    if (occupant.id != param.id) {
        sendErrors(404, errorDefinition.occupant_not_found_auth)
    }

    let isCorrectPassword = await comparePassword(
        param.password,
        occupant.password
    )

    if (!isCorrectPassword)
        return sendErrors(404, errorDefinition.password_old_incorrect)

    const hashedNewPassword = await hashPassword(param.newPassword);

    await db().update(Occupant).set({
        password: hashedNewPassword
    }).where(eq(Occupant.id, param.id));

    const response: Response = {
        message: "Password Berhasil Diubah",
    };

    return sendData(200, response);
})