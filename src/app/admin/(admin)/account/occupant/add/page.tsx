import { AddOccupantForm } from "@/components/admin/account/add-occupant-form"
import { getHouses } from "@/lib/api"

export default async function AddOcuppantPage() {
  const [houses, housesErr] = await getHouses()

  if (housesErr) {
    throw new Error("Something went wrong")
  }

  return (
    <div className="my-6 ml-6 mr-[50%]">
      <AddOccupantForm houses={houses} />
    </div>
  )
}
