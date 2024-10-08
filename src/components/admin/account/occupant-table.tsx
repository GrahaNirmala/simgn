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

export default function OccupantTable({
  occupants,
  houses,
}: {
  occupants: GetAllOccupantsResponse[]
  houses: HouseResponse[]
}) {
  const sortedOccupants = [...occupants].sort((a, b) => a.name.localeCompare(b.name))
  return (
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
      {sortedOccupants.length > 0 &&
          sortedOccupants.map((occupant, index) => (
            <TableRow key={occupant.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{occupant.name}</TableCell>
              <TableCell>
                {houses.find((house) => house.id == occupant.house_id)?.code}
              </TableCell>
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
          ))}
      </TableBody>
    </Table>
  )
}
