import { BillListItem, BillTable } from "@/components/ui/bill"
import { getBills } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function OccupantBill({ houseId }: { houseId: string }) {
  let [bills, _err] = await getBills(houseId)

  if (!bills) {
    notFound()
  }

  return (
    <BillTable>
      {bills.length ? (
        bills.map((bill) => <BillListItem key={bill.id} bill={bill} />)
      ) : (
        <p>Tidak ada tagihan</p>
      )}
    </BillTable>
  )
}
