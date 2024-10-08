"use client";

import { FC, useState } from "react";
import { LoadingButton } from "./button"; // Menggunakan LoadingButton seperti di LogoutButton

export const ExportButton: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      // Memanggil API export data occupant
      const response = await fetch("/api/v1/occupant/export?export=excel");
      
      if (!response.ok) {
        throw new Error("Gagal mengekspor data.");
      }

      // Untuk mendownload file setelah export berhasil
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Data_penghuni.xlsx"); // Nama file yang akan di-download
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
    } catch (error) {
      console.error("Error during export:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleExport}
    >
      Export Data Penghuni
    </LoadingButton>
  );
};

export default ExportButton;
