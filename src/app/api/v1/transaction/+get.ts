import { db } from "@/server/db"
import { TransactionResponse } from "@/server/models/responses/transaction"
import { useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"
import { sql } from "drizzle-orm"

export const GET = defineHandler(async (req) => {
  useAuth(req)

  const results = await db().execute(
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
    UNION
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
        payment.status = 'settlement'
    ORDER BY
        created_at DESC`,
  )

  let response: TransactionResponse = {
    total_income: 0,
    total_outcome: 0,
    total: 0,
    transactions: [],
  }

  results.forEach((result) => {
    if (result.movement === "income") {
      response.total_income += parseInt(result.amount as string)
    } else if (result.movement === "outcome") {
      response.total_outcome += parseInt(result.amount as string)
    }

    response.transactions.push({
      id: result.transaction_id as number,
      title: result.title as string,
      created_at: result.created_at as Date,
      amount: parseInt(result.amount as string),
      movement: result.movement as string,
      description: result.description as string,
      source: result.source as string,
      storage_id: result.storage_id as number | null,
    })
  })

  response.total = response.total_income - response.total_outcome
  return sendData(200, response)
})
