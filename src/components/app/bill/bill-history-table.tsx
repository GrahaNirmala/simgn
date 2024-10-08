import BillHistoryItem from "./bill-history-item"
import { getPaymentHistory } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function BillHistoryTable({
  houseId,
}: {
  houseId: string
}) {
  const [paymentsHistory, _paymentsHistoryErr] =
    await getPaymentHistory(houseId)

  if (!paymentsHistory) {
    notFound()
  }

  return (
    <div className="bg-white p-4 mt-[1.125rem] lg:mt-9 rounded-3xl">
      <p className="text-sm font-bold sm:text-base">Riwayat Pembayaran</p>
      <div className="h-[2px] bg-gray-200 mt-3 mb-5" />
      <div className="flex flex-col gap-6 px-5">
        {paymentsHistory.length === 0 ? (
          <p className="text-navy text-base font-medium text-center">
            Tidak ada riwayat pembayaran
          </p>
        ) : (
          paymentsHistory.map((item) => (
            <BillHistoryItem
              key={item.id}
              status={item.status ?? ""}
              datePay={new Date(item.createdAt)}
              dateBill= {item.tanggalBilling ? new Date(item.tanggalBilling) : new Date()}
              amount={item.amount ?? 0}
            />
          ))
        )}
      </div>
    </div>
  )
}
