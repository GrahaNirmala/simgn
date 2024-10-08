"use client";

import { useState, useMemo } from "react";
import ReportSummaryCard from "@/components/admin/report/report-summary-card";
import ExportMontlyButton from "@/components/ui/export-montly-button";
import { TransactionCasflow } from "@/server/models/responses/transaction";
import ReportTable from "./report-table";
import { Button } from "@/components/ui/button";
import Icons from "@/components/ui/icons";

interface ReportData {
  transactions: TransactionCasflow[];
  total_income: number;
  total_outcome: number;
  total: number;
}

export default function ReportPageClient({ report }: { report: ReportData }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleMonthChange = (month: string, year: string) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const filteredReport = useMemo(() => {
    if (!selectedMonth || !selectedYear) return report;

    const transactions = report.transactions.filter((transaction) => {
      const date = new Date(transaction.created_at);
      const transactionMonth = String(date.getMonth() + 1).padStart(2, '0');
      const transactionYear = String(date.getFullYear());

      return transactionMonth === selectedMonth && transactionYear === selectedYear;
    });

    const total_income = transactions
      .filter((t) => t.movement === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const total_outcome = transactions
      .filter((t) => t.movement === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    const total = total_income - total_outcome;

    return {
      transactions,
      total_income,
      total_outcome,
      total,
    };
  }, [report, selectedMonth, selectedYear]);

  const sortedMonths = useMemo(() => {
    const months = new Set(
      report.transactions.map((t) => {
        const date = new Date(t.created_at);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format YYYY-MM
      })
    );
    return Array.from(months).sort();
  }, [report]);

  return (
    <>
      <div className="scrollable-container mb-4">
        <button
          className={`px-4 py-2 rounded ${selectedMonth === "" && selectedYear === "" ? "text-secondary border-b-2 border-secondary font-bold" : "text-black"}`}
          onClick={() => handleMonthChange("", "")}
        >
          Semua
        </button>
        {sortedMonths.map((month) => {
          const [year, monthPart] = month.split("-");
          return (
            <button
              key={month}
              className={`px-4 py-2 rounded ${selectedMonth === monthPart && selectedYear === year ? "text-secondary border-b-2 border-secondary font-bold" : "text-black"}`}
              onClick={() => handleMonthChange(monthPart, year)}
            >
              {new Date(`${year}-${monthPart}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </button>
          );
        })}
      </div>

      <ReportSummaryCard
        total={filteredReport.total}
        total_income={filteredReport.total_income}
        total_outcome={filteredReport.total_outcome}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      {selectedMonth && selectedYear && (
        <div className="mb-4">
          <ExportMontlyButton month={selectedMonth} year={selectedYear} />
        </div>
      )}
      <div className="mb-4">
        <Button asChild>
          <a href="/admin/transaction/add">
            <Icons.Plus size={20} className="mr-1" />
            Tambah transaksi
          </a>
        </Button>
      </div>
      <div className="bg-white mt-8 rounded-3xl">
        <ReportTable transactions={filteredReport.transactions} />
      </div>
    </>
  );
}
