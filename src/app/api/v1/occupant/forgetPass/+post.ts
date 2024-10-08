import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Occupant } from "@/server/db/schema";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { eq } from "drizzle-orm";
import { sendData, sendErrors } from "@/server/web/response"
import { z } from "zod";
import { generateResetToken } from "@/server/security/token";
import { sendEmail, mailTemplate } from "@/server/security/email";

const Param = z.object({
    email: z.string(),
})

export const POST = defineHandler(async (req)=>{
    const params = await bindJson(req, Param);
    const occupant =  await db().query.Occupant.findFirst({
        where: eq(Occupant.email, params.email)
    })

    if(!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

    const resetToken = generateResetToken(occupant.id.toString())

    const protocol = req.headers.get("x-forwarded-proto");
    const host = req.headers.get("x-forwarded-host");

    if(occupant.email === params.email){
        const resetUrl = `${protocol}://${host}/login/reset-pass?token=${resetToken}`;
        const message = mailTemplate(
            "Please click the button below to reset your password.",
            resetUrl,
            "Reset Password"
        );

        await sendEmail({
            email: occupant.email,
            subject: "Password Reset",
            message,
        });
    }
    return sendData(200, { message: "Silahkan Periksa Email Anda" });
})