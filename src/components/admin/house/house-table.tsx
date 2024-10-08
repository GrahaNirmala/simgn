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

export default function HouseTable({
  houses,
}: {
  houses: (HouseResponse & {
    owner: OccupantResponse | null
    renter: OccupantResponse | null
  })[]
}) {
  const sortedHouses = [...houses].sort((a, b) => a.code.localeCompare(b.code))
  return (
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
        {sortedHouses.length > 0 &&
          sortedHouses.map((house, index) => (
            <TableRow key={house.id}>
              <TableCell>{index + 1}</TableCell>
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
          ))}
      </TableBody>
    </Table>
  )
}
