import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dateFormat } from "@/lib/utils"
import { FamilyResponse } from "@/server/models/responses/family"

export default function FamilyTable({ family }: { family: FamilyResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Nama Lengkap</TableHead>
          <TableHead>NIK</TableHead>
          <TableHead>Jenis Kelamin</TableHead>
          <TableHead>Tempat Lahir</TableHead>
          <TableHead>Tanggal Lahir</TableHead>
          <TableHead>Agama</TableHead>
          <TableHead>Jenis Pekerjaan</TableHead>
          <TableHead>Status Perkawinan</TableHead>
          <TableHead>Status Hubungan Dalam Keluarga</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {family.length > 0 ? (
          family.map((familyMember, idx) => (
            <TableRow key={familyMember.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{familyMember.name.toUpperCase()}</TableCell>
              <TableCell>
                {familyMember.identity_number.toUpperCase()}
              </TableCell>
              <TableCell>{familyMember.gender.toUpperCase()}</TableCell>
              <TableCell>{familyMember.birthplace.toUpperCase()}</TableCell>
              <TableCell>
                {dateFormat(new Date(familyMember.birthday))}
              </TableCell>
              <TableCell>{familyMember.religion.toUpperCase()}</TableCell>
              <TableCell>{familyMember.job_type?.toUpperCase()}</TableCell>
              <TableCell>{familyMember.marital_status.toUpperCase()}</TableCell>
              <TableCell>
                {familyMember.relationship_status.toUpperCase()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={13} className="h-24 text-center">
              Tidak ada data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
