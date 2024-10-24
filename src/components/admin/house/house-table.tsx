"use client"
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
import { HouseResponse } from "@/server/models/responses/house"
import { OccupantResponse } from "@/server/models/responses/occupant"
import { useState } from "react"


export default function HouseTable({
  houses,
}: {
  houses: (HouseResponse & {
    owner: OccupantResponse | null
    renter: OccupantResponse | null
  })[]
}) {

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const sortAlphanumeric = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  }

  const filteredHouses = houses
    .filter((house) =>
      house.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => sortAlphanumeric(a.code, b.code))

  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage)
  const paginatedHouses = filteredHouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Cari Kavling"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-80"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Kav.</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedHouses.length > 0 ? (
            paginatedHouses.map((house, index) => (
              <TableRow key={house.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{house.code}</TableCell>
                <TableCell>{house.address}</TableCell>
                <TableCell>
                  <a href={`/admin/house/edit/${house.id}`}>
                    <Button className="mr-1" variant="outline" size="sm">
                      Edit
                    </Button>
                  </a>
                  <DeleteAlertDialog
                    message={`Apakah anda yakin ingin menghapus ${house.code}?`}
                    domain="house"
                    id={house.id}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginatedHouses.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"
              }`}
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
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"
              }`}
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
  )
}
