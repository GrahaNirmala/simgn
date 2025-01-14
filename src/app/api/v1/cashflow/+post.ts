import { db } from "@/server/db";
import { Cashflow, CashFlowDocument, TInsertCashflow, TInsertCashFlowDocument } from "@/server/db/schema";
import { toCashflowResponse } from "@/server/models/responses/cashflow";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { uploadFile } from "@/server/storage";
import { logActivity } from "@/server/utils/logging";
import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";

export const POST = defineHandler(async (req) => {
  try {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    });

    const staff = await getCurrentStaff(req);

    // Expect FormData
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const movement = formData.get("movement") as "income" | "outcome";
    const description = formData.get("description") as string | null;


    if (!title || isNaN(amount) || !movement) {
      return sendErrors(400, { message: "Required fields are missing or invalid" });
    }

    let storageId: number | null = null;

    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      const storage = await uploadFile(file);
      storageId = storage.id;
    } else if (file) {
      return sendErrors(400, { message: "Uploaded file is empty or invalid" });
    }

    const cashflow: TInsertCashflow = {
      authorId: staff.id,
      title: title,
      amount: amount,
      movement: movement,
      description: description,
      storageId: storageId,
    };

    // Insert cashflow record
    const [newCashflow] = await db().insert(Cashflow).values(cashflow).returning();

    if (storageId) {
      const cashflowDocument: TInsertCashFlowDocument = {
        type: "receipt",
        cashFlowId: newCashflow.id,
        storageId: storageId,
      };

      await db().insert(CashFlowDocument).values(cashflowDocument);
    }
    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id ,
      "Transaksi",
      "Menambahkan",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} tambah Transaksi dengan judul ${cashflow.title}`,
    )

    return sendData(201, toCashflowResponse(newCashflow));
  } catch (error) {
    console.error("An error occurred:", error);
    return sendErrors(500, { message: "Internal Server Error" });
  }
});
