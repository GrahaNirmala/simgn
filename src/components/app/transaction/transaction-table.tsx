"use client"

import { useState, useMemo } from "react";
import TransactionListItem from "./transaction-list-item";
import { TransactionCasflow } from "@/server/models/responses/transaction";

export default function TransactionTable({
  transactions,
}: {
  transactions: TransactionCasflow[];
}) {
  const [activeTab, setActiveTab] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const sortedMonths = useMemo(() => {
    const months = new Set(
      transactions.map((t) => {
        const date = new Date(t.created_at);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    );
    return Array.from(months).sort();
  }, [transactions]);

  const handleTabClick = (month: string) => {
    if (month === activeTab) return;
    setActiveTab(month);
  };

  const handleFilterClick = (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (activeTab) {
        const date = new Date(transaction.created_at);
        const transactionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (transactionMonth !== activeTab) return false;
      }

      if (activeFilter === "income") {
        return transaction.movement === "income";
      } else if (activeFilter === "outcome") {
        return transaction.movement === "outcome";
      }

      return true;
    });
  }, [transactions, activeTab, activeFilter]);

  return (
    <>
    <div className="flex justify-evenly">
        <div
          className={`cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 ${
            activeFilter === "all" &&
            "text-secondary border-b-2 border-secondary font-bold"
          }`}
          onClick={() => handleFilterClick("all")}
        >
          Semua
        </div>
        <div
          className={`cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 ${
            activeFilter === "income" &&
            "text-secondary border-b-2 border-secondary font-bold"
          }`}
          onClick={() => handleFilterClick("income")}
        >
          Pemasukan
        </div>
        <div
          className={`cursor-pointer text-xs md:text-base px-[2%] py-2 md:py-4 ${
            activeFilter === "outcome" &&
            "text-secondary border-b-2 border-secondary font-bold"
          }`}
          onClick={() => handleFilterClick("outcome")}
        >
          Pengeluaran
        </div>
      </div>
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "" ? "text-secondary border-b-2 border-secondary font-bold" : "text-black"
          }`}
          onClick={() => handleTabClick("")}
        >
          All
        </button>
        {sortedMonths.map((month) => (
          <button
            key={month}
            className={`px-4 py-2 rounded ${
              activeTab === month ? "text-secondary border-b-2 border-secondary font-bold" : "text-black"
            }`}
            onClick={() => handleTabClick(month)}
          >
            {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-5 px-4 sm:px-9 py-6">
        {filteredTransactions.length === 0 ? (
          <p className="text-primary text-base font-medium text-center">
           Tidak ada transaksi kas
          </p>
        ) : (
          filteredTransactions.map((transaction, idx) => (
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
          ))
        )}
      </div>
    </>
  );
}