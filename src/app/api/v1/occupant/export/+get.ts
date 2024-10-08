import { errorDefinition } from "@/lib/constants";
import { db } from "@/server/db";
import { Family, House } from "@/server/db/schema";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { logActivity } from "@/server/utils/logging";
import { defineHandler } from "@/server/web/handler";
import { sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";

function calculateAge(birthday: Date): number {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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

    const occupants = await db().query.Occupant.findMany();

    if (occupants.length === 0) {
      return sendErrors(404, errorDefinition.occupant_not_found);
    }

    const allOccupantData = await Promise.all(
      occupants.map(async (occupant, index) => {
        const [house, family] = await Promise.all([
          db().query.House.findFirst({ where: eq(House.id, occupant.houseId) }),
          db().query.Family.findMany({ where: eq(Family.occupantId, occupant.id) })
        ]);

        const occupantData = {
          No: index + 1,
          Nama: occupant.name,
          Kav: house?.code ?? "-",
          Alamat_Rumah: house?.address ?? "-",
          No_telepon: occupant.phone ?? "-",
          Email: occupant.email ?? "-",
          Status: occupant.role === "owner" ? "Pemilik" : "Penyewa",
          Anggota_Keluarga: family.length > 0 ? { f: `HYPERLINK("#'${occupant.name}'!A1","LIHAT")` } : "-",
        };

        const familyData = family.map((member, i) => ({
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
      })
    );

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    const occupantSheetData = allOccupantData.map((data) => data.occupantData);
    const occupantWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(occupantSheetData);
    XLSX.utils.book_append_sheet(workbook, occupantWorksheet, "Penghuni");

    allOccupantData.forEach((data) => {
      if (data.familyData.length > 0) {
        const familyWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data.familyData);
        XLSX.utils.book_append_sheet(workbook, familyWorksheet, `${data.occupantName}`);
      }
    });
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const stream = bufferToReadableStream(excelBuffer);

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id,
      "Data Penghuni",
      "Export",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Melakukan Export Data Penghuni Perumahan`
    );

    return new Response(stream, {
      headers: {
        "Content-Disposition": `attachment; filename="occupants_data.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      status: 200,
    });
  }
);
