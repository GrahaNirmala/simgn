import { numberFormat } from "@/lib/utils"

export default function TransactionSummaryCard({
  total,
  total_income,
  total_outcome,
}: {
  total_income: number
  total_outcome: number
  total: number
}) {
  return (
    <div className="bg-white rounded-3xl w-fit p-4 mx-auto">
      <div className="text-center">
        <div className="txt-lead md:text-base md:font-bold">Total Kas</div>
        <div className="text-lg text-secondary font-bold md:text-xl md:font-bold">
          {numberFormat(total)}
        </div>
      </div>

      <div className="flex gap-5 mt-5">
        <div className="bg-success/10 py-2 px-4 text-center rounded-3xl">
          <div className="flex items-center justify-evenly">
            <div className="w-8 max-w-[8px] h-2 max-h-[8px] justify-self-end rounded-full bg-success mr-2" />
            <div className="text-xs">Pemasukan</div>
          </div>

          <div className="txt-lead text-success">
            {numberFormat(total_income)}
          </div>
        </div>
        <div className="bg-destructive/10 py-2 px-4 text-center rounded-3xl">
          <div className="flex items-center justify-evenly">
            <div className="w-8 max-w-[8px] h-2 max-h-[8px] justify-self-end rounded-full bg-destructive mr-2" />
            <div className="text-xs">Pengeluaran</div>
          </div>

          <div className="txt-lead text-destructive">
            {numberFormat(total_outcome)}
          </div>
        </div>
      </div>
    </div>
  )
}
