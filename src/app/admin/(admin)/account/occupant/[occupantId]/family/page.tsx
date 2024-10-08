import { Button } from "@/components/ui/button"
import FamilyCardData from "@/components/ui/family-card"
import FamilyTable from "@/components/ui/family-table"
import Icons from "@/components/ui/icons"
import { getFamily, getOccupant } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function AdminFamilyPage({
  params,
}: {
  params: { occupantId: string }
}) {
  const [family, errs] = await getFamily(params.occupantId)

  if (!family) {
    notFound()
  }

  const [familyCardData] = await getOccupant(params.occupantId)

  if (!familyCardData) {
    notFound()
  }

  return (
    <div className="m-6">
      <FamilyCardData familyCardData={familyCardData} />
      <Button asChild>
        <a href={`/admin/account/occupant/${params.occupantId}/family/add`}>
          <Icons.Plus size={20} className="mr-1" />
          Tambah Anggota Keluarga
        </a>
      </Button>
      <FamilyTable family={family} />
    </div>
  )
}
