"use client"
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
import { useEffect, useState } from "react";
  
  export default function LogActivityTable({
    logs,
  }: {
    logs: LogActivityResponse[];
  }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);

    const filteredLogs = logs
      .filter((log) => {
        const authorName =
          log.author?.role === "secretary"
            ? "Sekretaris"
            : log.author?.role === "treasurer"
            ? "Bendahara"
            : log.author?.name ?? "N/A";
        return (
          authorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    return (
      <div className="space-y-4">
      <div className="flex justify-between space-x-4">
        <input
          type="text"
          placeholder="Cari Nama Pengurus"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-80"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Pengurus</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log, index) => {
              const authorName =
                log.author?.role === "secretary"
                  ? "Sekretaris"
                  : log.author?.role === "treasurer"
                  ? "Bendahara"
                  : log.author?.name ?? "N/A";
              return (
                <TableRow key={log.id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
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
                Tidak ada log pengurus yang ditemukan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginatedLogs.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"}`}
          >
            Sebelumnya
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-500 text-white" : "bg-primary text-white hover:bg-primary/80"}`}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
    )
  }
  