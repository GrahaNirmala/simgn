import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { Family } from "@/server/db/schema"
import { getCurrentOccupant, getCurrentStaff, throwFailed, useAuth } from "@/server/security/auth"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { sendErrors, sendData } from "@/server/web/response"
import { eq } from "drizzle-orm"

export const DELETE = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    const { role_type } = useAuth(req, {
      staff: ["admin", "secretary"],
      occupant: true,
    });

    let staff = null;
    
    if (role_type === "staff") {
      staff = await getCurrentStaff(req);
    }
    const familyMember = await db().query.Family.findFirst({
      where: eq(Family.id, params.id),
    })
    if (!familyMember) return sendErrors(404, errorDefinition.occupant_not_found)

    const occupant = await getCurrentOccupant(req);

    if (!occupant) {
      return sendErrors(404, errorDefinition.occupant_not_found);
    }
    
    if (occupant.id !== familyMember.occupantId) {
      throwFailed();
    }

    await db().delete(Family).where(eq(Family.id, params.id))
    
    if (staff) {
      const formattedRole = staff.role === "secretary" 
        ? "sekretaris" 
        : staff.role === "treasurer" 
        ? "bendahara" 
        : staff.role;
      await logActivity(
        staff.id,
        "Anggota Keluarga",
        "Menghapus",
        `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menghapus data Anggota Keluarga dengan nama ${familyMember.name}`
      );
    }
    return sendData(200, { message: "Family member deleted successfully" })
  },
)
