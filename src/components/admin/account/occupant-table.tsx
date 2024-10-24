"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import DeleteAlertDialog from "@/components/ui/delete-alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { roleValue } from "@/lib/constants"
import { HouseResponse } from "@/server/models/responses/house"
import { GetAllOccupantsResponse } from "@/server/models/responses/occupant"

const ITEMS_PER_PAGE = 10

export default function OccupantTable({
  occupants,
  houses,
}: {
  occupants: GetAllOccupantsResponse[]
  houses: HouseResponse[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredOccupants = occupants
    .filter((occupant) => {
      const houseCode = houses.find((house) => house.id === occupant.house_id)?.code || ""
      return (
        occupant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        houseCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => {
      const houseA = houses.find((house) => house.id === a.house_id)?.code || ""
      const houseB = houses.find((house) => house.id === b.house_id)?.code || ""
      return houseA.localeCompare(houseB, undefined, { numeric: true, sensitivity: 'base' })
    })

  const totalPages = Math.ceil(filteredOccupants.length / ITEMS_PER_PAGE)
  const paginatedOccupants = totalPages > 0 ? filteredOccupants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) : []

  return (
    <div className="mt-6">

      <div className="flex justify-start mb-6">
        <input
          type="text"
          placeholder="Cari nama atau kavling..."
          className="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kav.</TableHead>
            <TableHead>No. Telp</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Kartu Keluarga</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOccupants.length > 0 ? (
            paginatedOccupants.map((occupant, index) => (
              <TableRow key={occupant.id}>
                <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                <TableCell>{occupant.name}</TableCell>
                <TableCell>{houses.find((house) => house.id === occupant.house_id)?.code}</TableCell>
                <TableCell>{occupant.phone ?? "-"}</TableCell>
                <TableCell>{occupant.email ?? "-"}</TableCell>
                <TableCell>{roleValue[occupant.role]}</TableCell>
                <TableCell>
                  {occupant.is_family_card_uploaded ? (
                    <Button className="mr-1" variant="link" size="sm" asChild>
                      <a href={`/admin/account/occupant/${occupant.id}/family-card`}>
                        Lihat Dokumen
                      </a>
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Button className="mr-1" variant="outline" size="sm" asChild>
                    <a href={`/admin/account/occupant/${occupant.id}/family`}>
                      Lihat Keluarga
                    </a>
                  </Button>
                  <a href={`/admin/account/occupant/edit/${occupant.id}`}>
                    <Button className="mr-1" variant="outline" size="sm">
                      Edit
                    </Button>
                  </a>
                  <DeleteAlertDialog
                    message={`Apakah anda yakin ingin menghapus ${occupant.name}?`}
                    domain="occupant"
                    id={occupant.id}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {paginatedOccupants.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"}`}
          >
            Sebelumnya
          </Button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"}`}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  )
}
