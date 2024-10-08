import { Announcement, Bill, Transaction, TransactionSummary } from "./model"

export const dummyTransactions: Transaction[] = [
  {
    id: 0,
    belong_type: "CASHFLOW",
    created_at: "2023-07-30",
    amount: 52000,
    flow: "DEBIT",
    cashflow: {
      title: "Jajan gotong royong",
    },
  },
  {
    id: 1,  
    belong_type: "CASHFLOW",
    created_at: "2023-07-30",
    amount: 78000,
    flow: "DEBIT",
    cashflow: {
      title: "Jajan kegiatan rutin olahraga sore",
    },
  },
  {
    id: 2,
    belong_type: "BILLING",
    created_at: "2023-07-30",
    amount: 150000,
    flow: "CREDIT",
  },
  {
    id: 3,
    belong_type: "CASHFLOW",
    created_at: "2023-07-30",
    amount: 100000,
    flow: "DEBIT",
    cashflow: {
      title: "Jajan pos ronda",
    },
  },
  {
    id: 4,
    belong_type: "CASHFLOW",
    created_at: "2023-07-30",
    amount: 47000,
    flow: "DEBIT",
    cashflow: {
      title: "Jajan senam Jum'at",
    },
  },
]

export const dummyAnnouncements: Announcement[] = [
  {
    id: 0,
    title: "Perumahan",
    body: "Alhamdulillah",
    created_at: "2023-07-30",
  },
  {
    id: 1,
    title: "Perumahan",
    body: "Ujung dunia",
    created_at: "2023-07-30",
  },
]

export const dummyTransactionSummary: TransactionSummary = {
  total: 32_080_000,
  credit: 60_000_000,
  debit: 27_920_000,
}

export const dummyBillHistory: Bill[] = [
  {
    id: 1,
    status: "SETTLEMENT",
    created_at: "2023-07-30",
    amount: 150_000,
  },
]
