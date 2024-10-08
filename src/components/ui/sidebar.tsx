"use client"

import { usePathname } from "next/navigation"

import { routeNames } from "@/lib/constants"

import Icons from "./icons"
import NavItem from "./nav-item"
import LogoutDialog from "./logout-dialog"

const Sidebar = () => {
  const currentRoute = usePathname()

  return (
    <aside className="fixed z-10 bg-primary w-[15.5rem] text-center h-screen py-6 px-[1.15rem] hidden lg:flex lg:flex-col">
      <h3 className="text-white">SIMGN</h3>
      <div className="h-[3px] bg-slate-400 my-6" />
      <div className="flex flex-col space-y-3 text-white grow">
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

      <LogoutDialog className="w-full" />
    </aside>
  )
}

export default Sidebar
