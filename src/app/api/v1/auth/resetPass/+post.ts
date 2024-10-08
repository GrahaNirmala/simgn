import { errorDefinition } from "@/lib/constants";
import { config } from "@/server/config";
import { db } from "@/server/db";
import { Staff } from "@/server/db/schema";
import { hashPassword } from "@/server/security/password";
import { verifyToken } from "@/server/security/token";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import { z } from "zod";

const Param = z.object({
    token: z.string(),
    newPassword: z.string().min(8),
})

export const POST = defineHandler(async (req)=>{
    const params = await bindJson(req, Param)

    let payload;
    try{
        payload = verifyToken(params.token, config.jwt.secret)
    }catch(error){
        return sendErrors(400, errorDefinition.invalid_refresh_token)
    }

    const staff = await db().query.Staff.findFirst({
        where: eq(Staff.id, parseInt(payload.sub))
    })

    if(!staff) return sendErrors(404, errorDefinition.staff_not_found)

    const hashedPass = await hashPassword(params.newPassword)

    await db().update(Staff).set({
        password: hashedPass
    }).where(eq(Staff.id, staff.id))

    return sendData(200, { message: "Password reset successfully" });
})