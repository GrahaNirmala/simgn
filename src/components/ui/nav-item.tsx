import { FC } from "react"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface INavItemProp {
  Icon: LucideIcon
  isActive: boolean
  routeName: string
  children: React.ReactNode
}

const NavItem: FC<INavItemProp> = ({ Icon, isActive, routeName, children }) => (
  <Link
    href={routeName}
    className={`${
      isActive && "active-link-mobile lg:active-link"
    } flex flex-col min-w-[64px] gap-y-1 items-center lg:py-4 lg:px-7 lg:flex-row`}
  >
    {/* cannot use fill attr, because some icon doesn't support */}
    <Icon className="w-6 lg:w-7 h-auto lg:mr-3" />
    <p
      className={`${
        isActive && "font-medium lg:font-semibold"
      } text-xs lg:text-base`}
    >
      {children}
    </p>
  </Link>
)

export default NavItem
