import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { House, Occupant } from "@/server/db/schema";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { logActivity } from "@/server/utils/logging";
import { defineHandler } from "@/server/web/handler";
import { bindJson } from "@/server/web/request";
import { sendData, sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import { z } from "zod";

const Param = z.object({
  house_id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string(),
});

type Response = {
  message: string;
};

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {

    const { role_type } = useAuth(req, {
      staff: ["admin", "secretary"],
      occupant: true,
    });

    let staff = null;
    
    if (role_type === "staff") {
      staff = await getCurrentStaff(req);
    }

    let param = await bindJson(req, Param);

    const isHouseExists = await db().query.House.findFirst({
      where: eq(House.id, param.house_id),
    });
    if (!isHouseExists) return sendErrors(404, errorDefinition.house_not_found);

    let houseBelongToSomeone = await db().query.Occupant.findFirst({
      where: eq(Occupant.houseId, param.house_id),
    });

    if (param.email) {
      let occupantExists = await db().query.Occupant.findFirst({
        where: eq(Occupant.email, param.email),
      });
    }

    let phoneExists = await db().query.Occupant.findFirst({
      where: eq(Occupant.phone, param.phone),
    });

    if (phoneExists && phoneExists.id !== params.id) {
      return sendErrors(409, errorDefinition.phone_registered);
    }

    let occupant = await db().query.Occupant.findFirst({
      where: eq(Occupant.id, params.id),
    });
    if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found);

    occupant.houseId = param.house_id;
    occupant.name = param.name;
    occupant.email = param.email ?? null;
    occupant.phone = param.phone;

    await db().update(Occupant)
      .set({
        houseId: param.house_id,
        name: param.name,
        email: param.email ?? null,
        phone: param.phone,
      })
      .where(eq(Occupant.id, params.id));

    const response: Response = {
      message: "Data Berhasil Diubah",
    };


    if (staff) {
      const formattedRole = staff.role === "secretary" 
        ? "sekretaris" 
        : staff.role === "treasurer" 
        ? "bendahara" 
        : staff.role;
        
      await logActivity(
        staff.id,
        "Penghuni",
        "Mengubah",
        `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Mengubah data penghuni dengan nama ${param.name}`
      );
    }

    return sendData(200, response);
  }
);
