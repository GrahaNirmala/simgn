import LogActivityTable from "@/components/admin/log/log-table"
import { Tabs} from "@/components/ui/tabs"
import { getLogActivities } from "@/lib/api"

export default async function AdminLoggingPage() {
  const [logs, logsErr] = await getLogActivities()

  if (logsErr) {
    throw new Error("Something went wrong")
  }
  const logsData = logs ?? [];
  return (
    <div className="m-6">
      <Tabs defaultValue="logs">
        <div className="flex w-full justify-between items-center">
        <h4 className="text-primary">Tabel Aktivitas Staf</h4>
        </div>
        <LogActivityTable logs={logsData} />
      </Tabs>
    </div>
  )
}
