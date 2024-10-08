import { AddFamilyForm } from "@/components/ui/add-family-form"

export default function AdminAddFamilyPage({
  params,
}: {
  params: { occupantId: string }
}) {
  return (
    <div className="m-6">
      <AddFamilyForm occupantId={params.occupantId} />
    </div>
  )
}
