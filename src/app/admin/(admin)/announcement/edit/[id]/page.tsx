import { AnnouncementForm } from "@/components/admin/announcement/announcement-form"
import {
  getAnnouncement,
  getStaffs,
  getStorage,
} from "@/lib/api"
import { notFound } from "next/navigation"

export default async function EditAnnouncementPage({
  params,
}: {
  params: { id: string }
}) {
  const [[announcement], [staffs], [storage]] =
    await Promise.all([
      getAnnouncement(params.id),
      getStaffs(),
      getStorage(params.id),
    ])

  if (!announcement) {
    notFound()
  }

  return (
    <div className="m-6">
      <AnnouncementForm
        announcement={announcement}
        storage={storage}
      />
    </div>
  )
}
