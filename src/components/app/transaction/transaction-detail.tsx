"use client"

import { TransactionCasflow } from "@/server/models/responses/transaction"
import { dateFormat, numberFormat } from "@/lib/utils"
import { useState } from "react"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TransactionDetailProps = {
  transaction: TransactionCasflow | null;
  source: string;
};

const TransactionDetail = ({ transaction, source }: TransactionDetailProps) => {
  const [error, setError] = useState(false);

  if (!transaction) {
    return (
      <div className="p-4 text-gray-500">
        Transaction data is not available.
      </div>
    );
  }

  const formattedDate = transaction.created_at
    ? new Date(transaction.created_at)
    : new Date();

  return (
    <div className="p-6 bg-white border rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-primary mb-6">
        {transaction.title || "No Title"}
      </h1>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Tanggal:</span>{" "}
          <span className="text-gray-700">{dateFormat(formattedDate, true)}</span>
        </div>
        <div>
          <span className="font-semibold">Jumlah:</span>{" "}
          <span
            className={`text-lg font-semibold ${
              transaction.movement === "income"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {transaction.amount !== undefined
              ? numberFormat(transaction.amount)
              : "N/A"}
          </span>
        </div>
        <div>
          <span className="font-semibold">Jenis:</span>{" "}
          <span className="text-gray-700">
            {transaction.movement === "income"
              ? "Pemasukan"
              : transaction.movement === "outcome"
              ? "Pengeluaran"
              : ""}
          </span>
        </div>
        <div>
          <span className="font-semibold">Deskripsi:</span>{" "}
          <span className="text-gray-700">
            {transaction.description || ""}
          </span>
        </div>
      </div>
      {transaction.storage_id && (
        <div className="mt-6">
          <strong className="font-semibold block mb-2">Receipt:</strong>
          <div className="relative w-full h-64">
            {!error ? (
              <img
                alt="Transaction Receipt"
                src={`/api/v1/transaction/receipt/${transaction.id}`}
                style={{ objectFit: "contain", width: '100%', height: '100%' }}
                onError={() => setError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                Failed to load receipt image.
              </div>
            )}
          </div>
        </div>
      )}
      {source === "cashflow" && (
        <div className="mt-6">
          <Button asChild>
            <a href={`/admin/transaction/edit/${transaction.id}`}>
              Edit transaksi
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
