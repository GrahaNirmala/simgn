import { errorDefinition } from "@/lib/constants"
import { familySchema } from "@/lib/schema"
import { db } from "@/server/db"
import { Family } from "@/server/db/schema"
import { getCurrentOccupant, getCurrentStaff, throwFailed, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

const Param = familySchema

type Response = {
    message: string
  }

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
    const param = await bindJson(req, Param)

  
    const familyMember = await db().query.Family.findFirst({
      where: eq(Family.id, params.id),
    })
    if (!familyMember) return sendErrors(404, errorDefinition.family_not_found)

    const occupant = await getCurrentOccupant(req);

    if (!occupant) {
      return sendErrors(404, errorDefinition.occupant_not_found);
    }
    
    if (occupant.id !== familyMember.occupantId) {
      throwFailed();
    }

    const updateData = {
      name: param.name,
      identityNumber: param.identity_number,
      birthday: new Date(param.birthday),
      gender: param.gender,
      birthplace: param.birthplace,
      religion: param.religion,
      job_type: param.job_type,
      maritalStatus: param.marital_status,
      relationshipStatus: param.relationship_status,
    }

    await db().update(Family)
      .set(updateData)
      .where(eq(Family.id, params.id))
      .returning()

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
        "Anggota Keluarga",
        "Mengubah",
        `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Mengubah data Anggota Keluarga dengan nama ${param.name}`
      );
    }
    return sendData(200, response)
  }
)
