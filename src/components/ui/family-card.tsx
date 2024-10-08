import { OccupantResponse } from "@/server/models/responses/occupant"
import React from "react"


export default function FamilyCardData({familyCardData}: {familyCardData: OccupantResponse}) {
  const familyCard = familyCardData.familyCard; // Access the familyCard object

  if (!familyCard) {
    return (
        <div className="border p-4 mb-6 rounded-md bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Kartu Keluarga</h2>
            <div>Kartu Keluarga Data Tidak Tersedia</div>
        </div>
    );
  }
  return (
    <div className="border p-4 mb-6 rounded-md bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-2">Kartu Keluarga</h2>
      <div className="mb-4">
        <strong>No. KK:</strong> {familyCard.noFamilyCard}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <strong>Nama Kepala Keluarga:</strong>
            <span>{familyCard.nameHeadFamily}</span>
          </div>
          <div className="flex justify-between">
            <strong>Alamat:</strong>
            <span>{familyCard.addressCard}</span>
          </div>
          <div className="flex justify-between">
            <strong>RT/RW:</strong>
            <span>{familyCard.rtRwCard}</span>
          </div>
          <div className="flex justify-between">
            <strong>Kode Pos:</strong>
            <span>{familyCard.posCodeCard}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <strong>Desa/Kelurahan:</strong>
            <span>{familyCard.desaCard}</span>
          </div>
          <div className="flex justify-between">
            <strong>Kecamatan:</strong>
            <span>{familyCard.kecamatanCard}</span>
          </div>
          <div className="flex justify-between">
            <strong>Kabupaten/Kota:</strong>
            <span>{familyCard.kabupatenCard}</span>
          </div>
          <div className="flex justify-between">
            <strong>Provinsi:</strong>
            <span>{familyCard.provinsiCard}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
