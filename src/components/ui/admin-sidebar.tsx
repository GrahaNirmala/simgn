"use client"

import { usePathname } from "next/navigation"

import { adminRouteNames } from "@/lib/constants"

import Icons from "./icons"
import NavItem from "./nav-item"
import LogoutDialog from "./logout-dialog"

const AdminSidebar = () => {
  const currentRoute = usePathname()
  return (
    <aside className="fixed z-10 bg-primary w-[15.5rem] text-center h-screen py-6 px-[1.15rem] hidden lg:flex lg:flex-col">
      <h3 className="text-white">SIMGN</h3>
      <div className="h-[3px] bg-slate-400 my-6" />
      <div className="flex flex-col space-y-3 text-white grow">
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
          Icon={Icons.Receipt}
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

      <LogoutDialog className="w-full" />
    </aside>
  )
}

export default AdminSidebar
