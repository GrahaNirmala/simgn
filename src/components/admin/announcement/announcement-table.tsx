import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "@/components/ui/delete-alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnnouncementResponse } from "@/server/models/responses/announcement";
import Image from "next/image";

export default function AnnouncementTable({
  announcements,
}: {
  announcements: AnnouncementResponse[]
}) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor</TableHead>
          <TableHead>Judul</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Lampiran</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {announcements.length > 0 &&
          announcements.map((announcement, index) => {
            return (
              <TableRow key={announcement.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{announcement.content}</TableCell>
                <TableCell>{announcement.author?.name}</TableCell>
                <TableCell>
                  {announcement.storage_id ? (
                    <div className="w-32 h-32 overflow-hidden">
                    <img
                      alt="Lampiran"
                      src={`/api/v1/announcement/${announcement.id}/attachment`}
                      width={50}
                      height={50}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>                  
                  ) : (
                    <span>Tidak ada lampiran</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-1">
                  <a href={`/admin/announcement/edit/${announcement.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </a>
                <DeleteAlertDialog
                  message={`Apakah anda yakin ingin menghapus ${announcement.title}?`}
                  domain="announcement"
                  id={announcement.id}
                />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
