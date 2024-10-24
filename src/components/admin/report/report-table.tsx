"use client"

import { useState } from "react";
import { TransactionCasflow } from "@/server/models/responses/transaction";
import TransactionListItem from "@/components/app/transaction/transaction-list-item";

export default function ReportTable({
  transactions,
}: {
  transactions: TransactionCasflow[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabClick = (category: string) => {
    if (category === activeTab) return;
    setActiveTab(category);
  };

  return (
    <>
      <div className="flex justify-evenly w-full">
        <div
          className={`flex-1 cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 text-center ${
            activeTab === "all" &&
            "text-secondary border-b-2 border-secondary font-bold rounded-b-[10px]"
          }`}
          onClick={() => handleTabClick("all")}
        >
          Semua
        </div>
        <div
          className={`flex-1 cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 text-center ${
            activeTab === "income" &&
            "text-secondary border-b-2 border-secondary font-bold rounded-b-[10px]"
          }`}
          onClick={() => handleTabClick("income")}
        >
          Pemasukan
        </div>
        <div
          className={`flex-1 cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 text-center ${
            activeTab === "outcome" &&
            "text-secondary border-b-2 border-secondary font-bold rounded-b-[10px]"
          }`}
          onClick={() => handleTabClick("outcome")}
        >
          Pengeluaran
        </div>
      </div>
      <div className="flex flex-col gap-5 px-4 sm:px-9 py-6">
        {transactions.length === 0 ? (
          <p className="text-primary text-base font-medium text-center">
            Tidak ada transaksi kas
          </p>
        ) : (
          transactions
            .filter((transaction) => {
              if (activeTab === "all") return true;
              return transaction.movement === activeTab;
            })
            .map((transaction, idx) => {
              return (
                <TransactionListItem
                  key={idx}
                  date={
                    transaction.created_at
                      ? new Date(transaction.created_at)
                      : new Date()
                  }
                  amount={transaction.amount ?? 0}
                  flow={transaction.movement}
                  title={transaction.title}
                  source={transaction.source}
                  id={transaction.id}
                />
              );
            })
        )}
      </div>
    </>
  );
}