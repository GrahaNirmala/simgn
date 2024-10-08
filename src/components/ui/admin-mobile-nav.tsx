"use client"

import { usePathname } from "next/navigation"
import Icons from "./icons"
import NavItem from "./nav-item"
import { adminRouteNames } from "@/lib/constants"

export default function AdminMobileNav() {
  const currentRoute = usePathname()

  return (
    <div className="flex justify-evenly bg-primary py-6 fixed bottom-0 w-full text-white/40 lg:hidden">
      <NavItem
          Icon={Icons.UserSquare2}
          isActive={currentRoute.includes(adminRouteNames.account)}
          routeName={adminRouteNames.account}
        >
          Akun
        </NavItem>
        <NavItem
          Icon={Icons.Home}
          isActive={currentRoute.includes(adminRouteNames.house)}
          routeName={adminRouteNames.house}
        >
          Rumah
        </NavItem>
        <NavItem
          Icon={Icons.LayoutDashboard}
          isActive={currentRoute.includes(adminRouteNames.announcement)}
          routeName={adminRouteNames.announcement}
        >
          Pengumuman
        </NavItem>
        <NavItem
          Icon={Icons.ArrowLeftRight}
          isActive={currentRoute.includes(adminRouteNames.transaction)}
          routeName={adminRouteNames.transaction}
        >
          Transaksi
        </NavItem>
        <NavItem
          Icon={Icons.Repeat}
          isActive={currentRoute.includes(adminRouteNames.bill)}
          routeName={adminRouteNames.bill}
        >
          Tagihan
        </NavItem>
        <NavItem
          Icon={Icons.Loader}
          isActive={currentRoute.includes(adminRouteNames.log)}
          routeName={adminRouteNames.log}
        >
          Log Pengurus
        </NavItem>
    </div>
  )
}
