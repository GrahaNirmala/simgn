import { FC, useState } from "react";
import { LoadingButton } from "./button"; 

interface ExportMontlyButtonProps {
  month: string; // Bulan yang difilter
  year: string;  // Tahun yang difilter
}

export const ExportMontlyButton: FC<ExportMontlyButtonProps> = ({ month, year }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      // Kirim permintaan dengan parameter bulan dan tahun yang difilter
      const response = await fetch(`/api/v1/report/export?month=${month}&year=${year}`);

      if (!response.ok) {
        throw new Error("Gagal mengekspor data.");
      }

      const disposition = response.headers.get("Content-Disposition");
      let filename = "Report_Montly.xlsx";

      if (disposition && disposition.includes("filename=")) {
        const matches = disposition.match(/filename="(.+)"/);
        if (matches?.[1]) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
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
      Export Report Bulanan
    </LoadingButton>
  );
};

export default ExportMontlyButton;
