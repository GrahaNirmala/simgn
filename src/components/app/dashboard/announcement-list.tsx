import { getAnnouncements } from "@/lib/api"
import AnnouncementBox from "../../ui/announcement-box"

export default async function AnnouncementList() {
  const [announcements, err] = await getAnnouncements()

  return (
    <>
      <h6>Pemberitahuan</h6>
      {err ? (
        <div className="flex flex-col gap-6 mt-2 md:mt-3">
          <div className="flex items-end p-8 text-navy bg-white justify-center rounded-3xl mt-6">
            <p className="text-primary font-medium text-center">
              Terjadi masalah ketika memuat Pengumuman
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-2 md:mt-3">
          {announcements.length === 0 ? (
            <div className="flex items-end p-8 text-navy bg-white justify-center rounded-3xl">
              <p className="text-primary font-medium text-center">
                Tidak ada pemberitahuan
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <AnnouncementBox
                key={announcement.id}
                title={announcement.title}
                content={announcement.content}
                date={new Date(announcement.created_at)}
              />
            ))
          )}
        </div>
      )}
    </>
  )
}
