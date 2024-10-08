import { db } from "@/server/db"
import { CashFlowDocument, Cashflow} from "@/server/db/schema"
import { useAuth } from "@/server/security/auth"
import { getFile } from "@/server/storage"
import { defineHandler } from "@/server/web/handler"
import { sendErrors } from "@/server/web/response"
import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req)

    const cashflow = await db().query.Cashflow.findFirst({
      where: eq(Cashflow.id, params.id),
    })
    if (!cashflow) return sendErrors(404, { message: "Reciept not found" })

    const cashflowDocument = await db().query.CashFlowDocument.findFirst({
      with: {
        storage: true,
      },
      where: and(
        eq(CashFlowDocument.cashFlowId, params.id),
        eq(CashFlowDocument.type, "receipt"),
      ),
      orderBy: desc(CashFlowDocument.id),
    })
    if (!cashflowDocument || !cashflowDocument.storage) {
      return sendErrors(404, { message: "Reciept not found" })
    }

    const fileRef = await getFile(cashflowDocument.storage);
    const [fileBuffer] = await fileRef.download();
    const contentType = fileRef.metadata.contentType || "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${cashflowDocument.storage.name}${cashflowDocument.storage.ext}"`,
      },
    });
  },
)