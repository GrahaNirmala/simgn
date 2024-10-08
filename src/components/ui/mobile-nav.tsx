"use client"

import { usePathname } from "next/navigation"
import Icons from "./icons"
import NavItem from "./nav-item"
import { routeNames } from "@/lib/constants"

export default function MobileNav() {
  const currentRoute = usePathname()

  return (
    <div className="flex justify-evenly bg-primary py-6 fixed bottom-0 w-full text-white/40 lg:hidden">
      <NavItem
        Icon={Icons.LayoutDashboard}
        isActive={currentRoute.includes(routeNames.dashboard)}
        routeName={routeNames.dashboard}
      >
        Dashboard
      </NavItem>
      <NavItem
        Icon={Icons.ArrowLeftRight}
        isActive={currentRoute.includes(routeNames.transaction)}
        routeName={routeNames.transaction}
      >
        Transaksi
      </NavItem>
      <NavItem
        Icon={Icons.Receipt}
        isActive={currentRoute.includes(routeNames.bill)}
        routeName={routeNames.bill}
      >
        Tagihan
      </NavItem>
      <NavItem
        Icon={Icons.UserSquare2}
        isActive={currentRoute.includes(routeNames.profile)}
        routeName={routeNames.profile}
      >
        Profil
      </NavItem>
    </div>
  )
}
