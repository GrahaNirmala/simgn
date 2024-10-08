import { EditOccupantForm } from "@/components/admin/account/edit-occupant-form"
import { getHouses, getOccupant } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditOcuppantPage({
  params,
}: {
  params: { id: string }
}) {
  const [[occupant, _occupantErr], [houses, _housesErr]] = await Promise.all([
    getOccupant(params.id),
    getHouses(),
  ])

  if (!occupant) {
    notFound()
  }

  return (
    <div className="my-6 ml-6 mr-[50%]">
      <EditOccupantForm occupant={occupant} houses={houses} />
    </div>
  )
}
