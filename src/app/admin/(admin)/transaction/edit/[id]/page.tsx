import {TransactionForm} from "@/components/admin/transaction/transaction-form";
import { getCashFlow } from "@/lib/api";
import { notFound } from "next/navigation"

export default async function EditTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const [cashflow] =await getCashFlow(params.id)

  if (!cashflow) {
    notFound()
  }
  return (
    <div className="m-6">
      <TransactionForm cashflow={cashflow} />
    </div>
  )
}
