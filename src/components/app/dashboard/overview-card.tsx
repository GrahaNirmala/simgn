import Image from "next/image"

import { numberFormat } from "@/lib/utils"

const OverviewCard = ({
  title,
  total,
  icon,
  className,
}: {
  title: string
  total: number
  icon: string
  className: string
}) => {
  return (
    <div
      className={`${className} flex items-center gap-[1.125rem] px-4 pt-5 pb-4 rounded-3xl text-white sm:flex-col sm:justify-between sm:items-start sm:w-fit`}
    >
      <div className="">
        <Image src={`/images/${icon}`} alt={title} width={42} height={42} />
      </div>
      <div>
        <h5>{numberFormat(total)}</h5>
        <p>{`${title} (Rp)`}</p>
      </div>
    </div>
  )
}

export default OverviewCard
