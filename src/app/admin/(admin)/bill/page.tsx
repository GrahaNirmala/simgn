import { AdminBill } from "@/components/admin/bill/admin-bill"
import { getHouses } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Icons from "@/components/ui/icons"

export default async function AdminBillPage() {
  const [houses, err] = await getHouses()

  return (
    <div className="m-6">
      <div className="mb-4">
        <Button asChild>
          <a href="/admin/bill/change">
            <Icons.Plus size={20} className="mr-1" />
            Ubah Tagihan Bulanan
          </a>
        </Button>
      </div>
      <AdminBill
        houses={houses.filter((house) => house.owner || house.renter)}
      />
    </div>
  )
}
