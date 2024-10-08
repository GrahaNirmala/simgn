import { dateFormat, numberFormat } from "@/lib/utils"
import Image from "next/image"

export default async function BillHistoryItem({
  datePay,
  dateBill,
  status,
  amount,
}: {
  datePay: Date
  dateBill: Date
  status: string
  amount: number
}) {
  const getStatus = (statusType: string) => {
    switch (statusType) {
      case "settlement":
        return {
          title: "Berhasil",
          color: "bg-success",
        }

      case "failure":
        return {
          title: "Gagal",
          color: "bg-destructive",
        }

      case "deny":
        return {
          title: "Ditolak",
          color: "bg-destructive",
        }

      case "expire":
        return {
          title: "Kadaluwarsa",
          color: "bg-destructive",
        }

      default:
        return {
          title: "Unknown",
          color: "bg-primary",
        }
    }
  }
  return (
    <div className="flex sm:items-center gap-4">
      <div className="rounded-full h-[2.6875rem] p-2 aspect-square flex items-center shadow-simgn">
        <div className="relative w-[1.6875rem] h-4">
          <Image src="/images/money.svg" alt="Transaksi" fill={true} />
        </div>
      </div>
      <div className="flex flex-col flex-wrap gap-y-2 grow sm:flex-row sm:items-center">
        <div className="mr-auto pr-4">
          <p className="text-xs font-semibold sm:txt-lead text-primary">{`Bayar kas (${dateBill.toLocaleString(
            "id-ID",
            {
              month: "long",
            },
          )})`}</p>
          <p className="text-[0.625rem] sm:text-xs text-gray-400">
            {dateFormat(datePay, true)}
          </p>
        </div>
        <div className="pr-4 mr-auto">
          <div
            className={`px-2 text-[0.5rem] text-white py-1 rounded-3xl sm:txt-tiny sm:px-4 ${
              getStatus(status).color
            }`}
          >
            {getStatus(status).title}
          </div>
        </div>
        <p className="text-[0.625rem] sm:text-base font-bold">
          {numberFormat(amount)}
        </p>
      </div>
    </div>
  )
}
