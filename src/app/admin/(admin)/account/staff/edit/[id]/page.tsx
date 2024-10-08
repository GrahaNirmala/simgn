import { EditStaffForm } from "@/components/admin/account/edit-staff-form"
import { getStaff } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditStaffPage({
  params,
}: {
  params: { id: string }
}) {
  const [staff] = await getStaff(params.id)

  if (!staff) {
    notFound()
  }

  return (
    <div className="my-6 ml-6 mr-[50%]">
      <EditStaffForm staff={staff} />
    </div>
  )
}
