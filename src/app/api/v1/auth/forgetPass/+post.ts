import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Staff } from "@/server/db/schema";
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
    const staff =  await db().query.Staff.findFirst({
        where: eq(Staff.email, params.email)
    })

    if(!staff) return sendErrors(404, errorDefinition.staff_not_found)

    const resetToken = generateResetToken(staff.id.toString())

    const protocol = req.headers.get("x-forwarded-proto");
    const host = req.headers.get("x-forwarded-host");

    if(staff.email === params.email){
        const resetUrl = `${protocol}://${host}/admin/login/reset-pass?token=${resetToken}`;
        const message = mailTemplate(
            "Please click the button below to reset your password.",
            resetUrl,
            "Reset Password"
        );

        await sendEmail({
            email: staff.email,
            subject: "Password Reset",
            message,
        });
    }
    return sendData(200, { message: "Silahkan Periksa Email Anda" });
})