import AnnouncementTable from "@/components/admin/announcement/announcement-table"
import { Button } from "@/components/ui/button"
import Icons from "@/components/ui/icons"
import { getAnnouncements } from "@/lib/api"

export default async function AdminAnnouncementPage() {
  const [annoucements, annoucementsErr] = await getAnnouncements()

  return (
    <div className="m-6">
      <div className="flex gap-4">
        <Button asChild>
          <a href="/admin/announcement/add">
            <Icons.Plus size={20} className="mr-1" />
            Tambah Pengumuman
          </a>
        </Button>
      </div>
      <AnnouncementTable announcements={annoucements} />
    </div>
  )
}
