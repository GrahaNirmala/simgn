import TransactionListItem from "@/components/app/transaction/transaction-list-item"
import { Button } from "@/components/ui/button"
import { TransactionCasflow } from "@/server/models/responses/transaction"

export default function TransactionTableSummary({
  transactions,
}: {
  transactions: TransactionCasflow[]
}) {
  return (
    <>
      <h6>Transaksi Kas Terbaru</h6>
      <div className="h-[2px] w-full bg-gray-200 mt-3 mb-7" />
      <div className="flex flex-col gap-5">
        {transactions.length === 0 ? (
          <p className="text-primary text-base font-medium text-center">
            Tidak ada transaksi kas
          </p>
        ) : (
          transactions.map((transaction, idx) => {
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
            )
          })
        )}
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="sm" asChild>
          <a href="/app/transaction">LIHAT SEMUA</a>
        </Button>
      </div>
    </>
  )
}
