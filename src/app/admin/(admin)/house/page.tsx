import HouseTable from "@/components/admin/house/house-table"
import { Button } from "@/components/ui/button"
import Icons from "@/components/ui/icons"
import { getHouses } from "@/lib/api"

export default async function AdminHousePage() {
  const [houses, housesErr] = await getHouses()

  return (
    <div className="m-6">
      <Button asChild>
        <a href="/admin/house/add">
          <Icons.Plus size={20} className="mr-1" />
          Tambah Rumah
        </a>
      </Button>
      <HouseTable houses={houses} />
    </div>
  )
}
