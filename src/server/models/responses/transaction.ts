export type TransactionCasflow = {
  id: number
  title: string
  created_at: Date
  amount: number
  movement: string
  description: string
  source: string
  storage_id: number | null 
}

export type TransactionResponse = {
  total_income: number
  total_outcome: number
  total: number
  transactions: TransactionCasflow[]
}
