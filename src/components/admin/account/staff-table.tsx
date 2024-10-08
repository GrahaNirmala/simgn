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
import { StaffResponse } from "@/server/models/responses/staff"

export default function StaffTable({ staffs }: { staffs: StaffResponse[] }) {
  const sortedStaff = [...staffs].sort((a, b) => a.name.localeCompare(b.name))
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>No. Telp</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tipe</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStaff.length > 0 &&
          sortedStaff.map((staff, index) => (
            <TableRow key={staff.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{staff.name}</TableCell>
              <TableCell>{staff.phone}</TableCell>
              <TableCell>{staff.email ?? "-"}</TableCell>
              <TableCell>{roleValue[staff.role]}</TableCell>
              <TableCell>
                <a href={`/admin/account/staff/edit/${staff.id}`}>
                  <Button className="mr-1" variant="outline" size="sm">
                    Edit
                  </Button>
                </a>
                <DeleteAlertDialog
                  message={`Apakah anda yakin ingin menghapus ${staff.name}?`}
                  domain="staff"
                  id={staff.id}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
