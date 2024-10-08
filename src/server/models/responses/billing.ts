import { TBilling } from "@/server/db/schema"

export type BillingResponse = {
  id: number
  house_id: number
  period: Date
  amount: number
  is_paid: boolean
  extra_charge: number | null
  created_at: Date
  updated_at: Date | null
}

export function toBillingResponse(billing?: TBilling): BillingResponse | null {
  return billing
    ? {
        id: billing.id,
        house_id: billing.houseId,
        period: billing.period,
        amount: billing.amount,
        is_paid: billing.isPaid,
        extra_charge: billing.extraCharge,
        created_at: billing.createdAt,
        updated_at: billing.updatedAt,
      }
    : null
}
