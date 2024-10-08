import { dateFormat } from "@/lib/utils"

export default function AnnouncementBox({
  title,
  content,
  date,
}: {
  title: string
  content: string
  date: Date
}) {
  return (
    <div className="bg-white pb-6 rounded-3xl">
      <div className="px-8 mt-4">
        <h6 className="">{title}</h6>
        <p className="text-xs md:text-base text-primary">{content}</p>
        <div className="flex items-center mt-3">
          <p className="txt-tiny md:text-xs text-primary">{dateFormat(date)}</p>
        </div>
      </div>
    </div>
  )
}
