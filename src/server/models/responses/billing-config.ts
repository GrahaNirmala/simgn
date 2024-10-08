import { TbillingConfig } from "@/server/db/schema";


export type BillingConfigResponse = {
    id: number
    amount_bill: number
    extra_charge_bill: number | null
    created_at: Date
    updated_at: Date | null
}

export function toBillingConfigResponse(
    billingConfig?: TbillingConfig,
): BillingConfigResponse | null {
    return billingConfig
     ? {
        id: billingConfig.id,
        amount_bill: billingConfig.amountBill,
        extra_charge_bill: billingConfig.extraChargeBill,
        created_at: billingConfig.createdAt,
        updated_at: billingConfig.updatedAt,
      }
    :null
}