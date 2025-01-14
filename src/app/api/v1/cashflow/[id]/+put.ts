import { db } from "@/server/db"
import { CashFlowDocument, Cashflow, Storage, TInsertCashFlowDocument } from "@/server/db/schema"
import { CashflowResponse, toCashflowResponse } from "@/server/models/responses/cashflow"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { deleteFile, uploadFile } from "@/server/storage"
import { logActivity } from "@/server/utils/logging"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"


export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "treasurer"],
    })

    const staff = await getCurrentStaff(req)
    
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const movement = formData.get("movement") as "income" | "outcome"
    const description = formData.get("description") as string | null
    const file = formData.get("file") as File | null

    let cashflow = await db().query.Cashflow.findFirst({
      where: eq(Cashflow.id, params.id),
    })

    if (!title || isNaN(amount) || !movement) {
      return sendErrors(400, { message: "Required fields are missing or invalid" })
    }

    if (!cashflow) {
      return sendErrors(404, {message:"Cashflow tidak ditemukan"})
    }

    let storageId: number | null = cashflow.storageId

    if (file) {
      if(storageId){
        const oldStorage = await db().query.Storage.findFirst({
          where: eq(Storage.id, storageId)
        })
        if(oldStorage){
          await deleteFile(oldStorage)
        }
        await db().delete(Storage).where(eq(Storage.id, storageId))
      }
      const storage = await uploadFile(file as File)
      storageId = storage.id;
    }

    cashflow.title = title
    cashflow.amount = amount
    cashflow.movement = movement
    cashflow.description = description ?? null
    cashflow.storageId = storageId;
  

    await db()
      .update(Cashflow)
      .set(cashflow)
      .where(eq(Cashflow.id, params.id))
    
    // Update or insert the CashFlowDocument if storageId is updated
    if (storageId) {
      const existingDocument = await db().query.CashFlowDocument.findFirst({
        where: eq(CashFlowDocument.cashFlowId, params.id),
      })
      if (existingDocument) {
        await db()
          .update(CashFlowDocument)
          .set({ storageId: storageId })
          .where(eq(CashFlowDocument.cashFlowId, params.id))
      } else {
        const cashflowDocument: TInsertCashFlowDocument = {
          type: "receipt",
          cashFlowId: params.id,
          storageId: storageId,
        };

    await db().insert(CashFlowDocument).values(cashflowDocument);
  }
}

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id ,
      "Transaksi",
      "Mengubah",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Mengubah Transaksi dengan judul ${title}`,
    )

    return sendData(200, toCashflowResponse(cashflow))
  },
)
