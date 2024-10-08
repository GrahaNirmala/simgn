import { Metadata } from "next"

import FamilyCardImage from "@/components/app/profile/family-card-image"

export const metadata: Metadata = {
  title: "Kartu Keluarga - SIMGN",
}

export default function FamilyCardPage({
  params,
}: {
  params: { occupantId: string }
}) {
  return <FamilyCardImage occupantId={params.occupantId} />
}
