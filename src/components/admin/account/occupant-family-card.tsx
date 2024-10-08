"use client"
import Loading from '@/app/admin/(admin)/loading';
import { useEffect, useState } from 'react'

interface FamilyCard {
  storageId: string;
}

export default function OccupantCardImage({ occupantId }: { occupantId: string }) {
  const [familyCards, setFamilyCards] = useState<FamilyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/v1/storage/${occupantId}/family-card`)
      .then((response) => response.json())
      .then((response) => {
        if (response.status && response.data) {
          setFamilyCards(response.data)
        } else {
          setError('Data tidak ditemukan')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Terjadi kesalahan saat mengambil kartu keluarga')
        setLoading(false)
      })
  }, [occupantId])

  if (loading) {
    return <Loading />;
  }
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Kartu Keluarga
      </h2>
      {familyCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyCards.map((card, index) => (
            <div
              key={card.storageId}
              className="bg-white shadow-md rounded-lg p-4 col-span-1"
            >
              <p className="text-lg font-medium text-gray-700 mb-2">
                Kartu Keluarga {index + 1}
              </p>
              <img
                alt={`Lampiran Kartu Keluarga ${index + 1}`}
                src={`/api/v1/occupant/${card.storageId}/document/family-card`}
                className="w-full h-auto rounded-md border border-gray-300"
                style={{
                  maxHeight: '300px',
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Tidak ada kartu keluarga ditemukan.</p>
      )}
    </div>
  )
}
