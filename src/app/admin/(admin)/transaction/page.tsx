import ReportPageClient from "@/components/admin/report/report-page"
import { getTransaction } from "@/lib/api"

export default async function AdminTransactionPage() {
  const [report, err] = await getTransaction()

  if (err) {
    throw new Error("Something went wrong")
  }

  return (
    <div className="m-6">
      <ReportPageClient report={report} />
    </div>
  )
}