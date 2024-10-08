import { HouseForm } from "@/components/admin/house/house-form"
import { getHouse } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditHousePage({
  params,
}: {
  params: { id: string }
}) {
  const [house, _] = await getHouse(params.id)

  if (!house) {
    notFound()
  }

  return (
    <div className="m-6">
      <HouseForm house={house} />
    </div>
  )
}
