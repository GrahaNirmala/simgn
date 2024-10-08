"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function FamilyCardImage({
  occupantId,
}: {
  occupantId: string
}) {
  const [error, setError] = useState(false)

  useEffect(() => {
    if (error) {
      throw new Error("Gagal memuat gambar")
    }
  }, [error])

  return (
    <Image
      alt="Kartu Keluarga"
      fill={true}
      objectFit="contain"
      src={`/api/v1/occupant/${occupantId}/document/family-card`}
      onError={() => {
        setError(true)
      }}
    />
  )
}
