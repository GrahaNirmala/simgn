import { db } from "@/server/db";
import { TransactionCasflow } from "@/server/models/responses/transaction";
import { useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";
import { sql } from "drizzle-orm";

export const GET = defineHandler(async (req, { params }) => {
  useAuth(req); // Ensure the request is authenticated

  const { source, id } = params;

  try {
    let results: any[] = [];

    if (source === "cashflow") {
      results = await db().execute(
        sql`
        SELECT
          cashflow.id as transaction_id,
          cashflow.title,
          cashflow.created_at,
          cashflow.amount,
          cashflow.movement,
          cashflow.description,
          cashflow.storage_id,
          'cashflow' as source
        FROM
          cashflow
        WHERE
          cashflow.id = ${id}
        ORDER BY
          created_at DESC`,
      );
    } else if (source === "payment") {
      results = await db().execute(
        sql`
            SELECT
            payment.id as transaction_id,
            CONCAT('Pembayaran iuran oleh Rumah ', house.code) as title,
            payment.created_at,
            payment.amount,
            'income' as movement,
            CONCAT('Pembayaran iuran Bulanan Rumah ', house.code) as description,
            null as storage_id,
            'payment' as source
        FROM
            payment
        JOIN
            billing ON payment.billing_id = billing.id
        JOIN
            house ON billing.house_id = house.id
        WHERE
          payment.id = ${id}
        ORDER BY
          created_at DESC`,
      );
    }

    if (results.length === 0) {
      return sendErrors(404, { message: "Transaction not found" });
    }

    const transactions: TransactionCasflow[] = results.map((result) => ({
      id: result.transaction_id,
      title: result.title,
      created_at: result.created_at,
      amount: result.amount,
      movement: result.movement,
      description: result.description,
      source: result.source,
      storage_id: result.storage_id,
    }));

    return sendData(200, transactions);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return sendErrors(500, { message: "Internal server error" });
  }
});
