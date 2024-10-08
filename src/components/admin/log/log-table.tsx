import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { dateFormat } from "@/lib/utils";
  import { LogActivityResponse } from "@/server/models/responses/log-activity"
  
  export default function LogActivityTable({
    logs,
  }: {
    logs: LogActivityResponse[];
  }) {
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; 
    });
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log, index) => {
            const authorName =
              log.author?.role === "secretary"
                ? "Sekretaris"
                : log.author?.role === "treasurer"
                ? "Bendahara"
                : log.author?.name ?? "N/A";
            return (
              <TableRow key={log.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{authorName}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>
                  {dateFormat(
                    log.created_at ? new Date(log.created_at) : new Date(),
                    true
                  )}
                </TableCell>
              </TableRow>
            );
          })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No staff log activities found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }
  