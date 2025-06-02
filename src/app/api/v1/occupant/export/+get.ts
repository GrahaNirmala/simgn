import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Family, House, Occupant } from "@/server/db/schema";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { logActivity } from "@/server/utils/logging";
import { defineHandler } from "@/server/web/handler";
import { sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";

function calculateAge(birthday: Date): number {
  const today = new Date();
  const birthYear = new Date(birthday).getFullYear();
  let age = today.getFullYear() - birthYear;
  
  // Quick check without creating new Date objects
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const birthMonth = new Date(birthday).getMonth();
  const birthDate = new Date(birthday).getDate();
  
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDate < birthDate)) {
    age--;
  }
  return age;
}

function bufferToReadableStream(buffer: Buffer): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(buffer);
      controller.close();
    }
  });
}

export const GET = defineHandler(
  async (req) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    });

    const staff = await getCurrentStaff(req);

    const occupantsWithRelations = await db()
      .select({
        occupant: Occupant,
        house: House,
        familyMembers: Family
      })
      .from(Occupant)
      .leftJoin(House, eq(House.id, Occupant.houseId))
      .leftJoin(Family, eq(Family.occupantId, Occupant.id))
      .orderBy(House.id);

    if (occupantsWithRelations.length === 0) {
      return sendErrors(404, errorDefinition.occupant_not_found);
    }

    const occupantMap = new Map();

    occupantsWithRelations.forEach(row => {
      const occupantId = row.occupant.id;
      
      if (!occupantMap.has(occupantId)) {
        occupantMap.set(occupantId, {
          occupant: row.occupant,
          house: row.house,
          family: []
        });
      }
      
      if (row.familyMembers) {
        occupantMap.get(occupantId).family.push(row.familyMembers);
      }
    });

    const allOccupantData = Array.from(occupantMap.entries()).map(([_, data], index) => {
      const { occupant, house, family } = data;
      
      const occupantData = {
        No: index + 1,
        Nama: occupant.name,
        Kav: house?.code ?? "-",
        Alamat_Rumah: house?.address ?? "-",
        No_telepon: occupant.phone ?? "-",
        Email: occupant.email ?? "-",
        Status: occupant.role === "owner" ? "Pemilik" : "Penyewa",
        Anggota_Keluarga: family.length > 0 
          ? { f: `HYPERLINK("#'${occupant.name}'!A1","LIHAT")` } 
          : "-",
      };

      const familyData = family.map((member: any, i: number) => ({
        No: i + 1,
        Nama: member.name,
        NIK: member.identityNumber,
        Jenis_Kelamin: member.gender,
        Tempat_Lahir: member.birthplace,
        Tanggal_Lahir: member.birthday,
        Agama: member.religion,
        Pekerjaan: member.job_type,
        Status_Pernikahan: member.maritalStatus,
        Status_Hubungan_Dalam_Keluarga: member.relationshipStatus,
        Umur: calculateAge(member.birthday),
      }));

      return { occupantData, familyData, occupantName: occupant.name };
    });

    const workbook = XLSX.utils.book_new();

    const occupantSheetData = allOccupantData.map((data) => data.occupantData);
    const occupantWorksheet = XLSX.utils.json_to_sheet(occupantSheetData);
    XLSX.utils.book_append_sheet(workbook, occupantWorksheet, "Penghuni");

    allOccupantData
      .filter(data => data.familyData.length > 0)
      .forEach(data => {
        const familyWorksheet = XLSX.utils.json_to_sheet(data.familyData);
        // Truncate sheet name if too long (Excel limit is 31 characters)
        const sheetName = data.occupantName.length > 31 
          ? data.occupantName.substring(0, 31) 
          : data.occupantName;
        XLSX.utils.book_append_sheet(workbook, familyWorksheet, sheetName);
      });

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx", compression: true });

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    logActivity(
      staff.id,
      "Data Penghuni",
      "Export",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Melakukan Export Data Penghuni Perumahan`
    );

    const stream = bufferToReadableStream(excelBuffer);

    return new Response(stream, {
      headers: {
        "Content-Disposition": `attachment; filename="occupants_data.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      status: 200,
    });
  }
);
