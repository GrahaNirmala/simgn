import { errorDefinition } from "@/lib/constants"
import { familySchema } from "@/lib/schema"
import { db } from "@/server/db"
import { Family, Occupant, TInsertFamily } from "@/server/db/schema"
import { toFamilyResponse } from "@/server/models/responses/family"
import { getCurrentOccupant, getCurrentStaff, throwFailed, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { bindJson } from "@/server/web/request"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"

const Param = familySchema

export const POST = defineHandler(
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

    const occupant = await getCurrentOccupant(req)
    if (occupant.id != params.id) {
      throwFailed()
    }
    
    if (!occupant) return sendErrors(404, errorDefinition.occupant_not_found)

    const family: TInsertFamily = {
      occupantId: occupant.id,
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
    if (staff) {
      const formattedRole = staff.role === "secretary" 
        ? "sekretaris" 
        : staff.role === "treasurer" 
        ? "bendahara" 
        : staff.role;
      await logActivity(
        staff.id,
        "Anggota Keluarga",
        "Menambah",
        `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menambah data Anggota Keluarga dengan nama ${param.name}`
      );
    }
    const [newFamily] = await db().insert(Family).values(family).returning()
    return sendData(201, toFamilyResponse(newFamily))
  },
)
