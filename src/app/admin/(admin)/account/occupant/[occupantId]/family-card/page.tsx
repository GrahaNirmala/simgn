import OccupantCardImage from "@/components/admin/account/occupant-family-card"


export default function OccupantCardPage({
  params,
}: {
  params: { occupantId: string }
}) {
  return <OccupantCardImage occupantId={params.occupantId} />
}
