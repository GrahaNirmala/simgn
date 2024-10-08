import { StaffResponse } from "@/server/models/responses/staff"

export interface Billing {
  account_id?: number
  amount?: number
  created_at?: string
  id?: number
  period?: string
  transactions?: Transaction[]
}

export interface Cashflow {
  amount?: number
  created_at?: string
  id?: number
  title?: string
  transaction?: string
  updated_at?: string
}

export interface Transaction {
  amount?: number
  belong_id?: number
  belong_type?: string
  billing?: Billing
  cashflow?: Cashflow
  created_at?: string
  flow?: string
  id?: number
  invoice?: string
  status?: string
  token?: string
  updated_at?: string
}

export interface Announcement {
  body?: string
  created_at?: string
  id?: number
  title?: string
  updated_at?: string
}

export interface TransactionSummary {
  total?: number
  credit?: number
  debit?: number
}

export interface Bill {
  id?: number
  status?: string
  created_at?: string
  updated_at?: string
  amount?: number
}

export interface Occupant {
  id: number
  name?: string
  role: string
  created_at?: Date
  updated_at?: Date
  house_id?: number
  email?: string
  phone?: string
}

export interface OccupantLogin {
  token: string
  occupant: Occupant
}

export interface House {
  id: number
  code?: string
  address?: string
  created_at?: Date
  updated_at?: Date
}

export interface StaffLogin {
  token: string
  staff: StaffResponse
}
