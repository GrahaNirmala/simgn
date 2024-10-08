import { TCashflow } from "@/server/db/schema"

export type CashflowResponse = {
  id: number
  author_id: number
  title: string
  amount: number
  movement: "income" | "outcome"
  description: string | null
  created_at: Date
  updated_at: Date | null
  storage_id: number | null
}

export function toCashflowResponse(
  cashflow?: TCashflow,
): CashflowResponse | null {
  return cashflow
    ? {
        id: cashflow.id,
        author_id: cashflow.authorId,
        title: cashflow.title,
        amount: cashflow.amount,
        movement: cashflow.movement,
        description: cashflow.description,
        created_at: cashflow.createdAt,
        updated_at: cashflow.updatedAt,
        storage_id: cashflow.storageId,
      }
    : null
}
