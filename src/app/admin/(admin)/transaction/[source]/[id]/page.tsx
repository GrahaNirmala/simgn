"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionDetail from "@/components/app/transaction/transaction-detail";
import { getTransactionById } from "@/lib/api";
import { TransactionCasflow } from "@/server/models/responses/transaction";
import Loading from "../../../loading";

export default function TransactionDetailPage({
  params,
}: {
  params: { source: string; id: string };
}) {
  const [transaction, setTransaction] = useState<TransactionCasflow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTransaction() {
      const [data, errs] = await getTransactionById(params.source, params.id);

      if (errs || !data || data.length === 0) {
        setError("Failed to load transaction data.");
        router.replace("/404"); // Redirect to 404 page if transaction not found
      } else {
        const transactionData = data[0]; // Access the first transaction directly
        setTransaction(transactionData);
      }
      setLoading(false);
    }

    fetchTransaction();
  }, [params.source, params.id, router]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return transaction ? (
    <TransactionDetail transaction={transaction} source={params.source} />
  ) : (
    <div className="flex justify-center items-center h-full">
      <p>No transaction found.</p>
    </div>
  );
}
