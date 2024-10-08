"use client"

import { ReactNode } from "react"
import { toast } from "sonner"

import { catchError, numberFormat } from "@/lib/utils"  
import { BillingResponse } from "@/server/models/responses/billing"
import { useRouter } from "next/navigation"
import { payBill, payBillCash } from "@/lib/api"
import PayBillAlertDialog from "./confirm-dialog"

export const BillTable = ({ children }: { children: ReactNode }) => (
  <div className="bg-white p-4 mt-[1.125rem] lg:mt-9 rounded-3xl">
    <p className="font-bold text-sm sm:text-base">Tagihan</p>
    <div className="h-[2px] bg-gray-200 mt-3 mb-5" />
    <div className="flex flex-col gap-4 px-5 py-2 rounded-md hover:bg-gray-100">
      {children}
    </div>
  </div>
)

export function BillListItem({
  bill,
  occupantId,
}: {
  bill: BillingResponse
  occupantId?: number
}) {
  const totalAmount = bill.amount + (bill.extra_charge || 0);
  return (
    <div className="flex justify-between items-center gap-x-4">
      <div className="flex flex-col gap-x-4 flex-wrap flex-1">
        <p className="font-bold text-sm">{`${new Date(
          bill.period,
        ).toLocaleString("id-ID", {
          month: "long",
        })} ${new Date(bill.period).getFullYear()}`}</p>
        <p className="text-sm sm:text-base">{numberFormat(totalAmount)}</p>
      </div>
      <PayBillAlertDialog bill={bill} occupantId={occupantId} />
    </div>
  )
}
