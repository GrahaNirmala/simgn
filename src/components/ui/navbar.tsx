"use client"

import { useState } from "react"
import { useParams, usePathname } from "next/navigation"
import LogoutDialog from "./logout-dialog"
import { Icons } from "./icons"
import NavItem from "./nav-item"
import { adminRouteNames } from "@/lib/constants"

const pageName: { [key: string]: string } = {
  "/app/dashboard": "Dashboard",
  "/app/transaction": "Transaksi",
  "/app/bill": "Tagihan",
  "/app/profile": "Profil",
  "/app/profile/family": "Daftar Keluarga",
  "/app/profile/family/add": "Tambah Keluarga",
  "/app/profile/family-card": "Kartu Keluarga",

  "/admin/account": "Kelola Akun",
  "/admin/account/staff/add": "Tambah Pengurus",
  "/admin/account/staff/edit": "Edit Pengurus",
  "/admin/account/occupant/add": "Tambah Penghuni",
  "/admin/account/occupant/edit": "Edit Penghuni",
  "/admin/account/occupant/family": "Kelola Keluarga Penghuni",
  "/admin/account/occupant/family/add": "Tambah Anggota Keluarga Penghuni",
  "/admin/account/occupant/family-card": "Kartu Keluarga Penghuni",

  "/admin/house": "Kelola Rumah",
  "/admin/house/add": "Tambah Rumah",
  "/admin/house/edit": "Edit Rumah",

  "/admin/announcement": "Kelola Pengumuman",
  "/admin/announcement/add": "Tambah Pengumuman",
  "/admin/announcement/edit": "Edit Pengumuman",

  "/admin/transaction": "Kelola Transaksi",
  "/admin/transaction/add": "Tambah Transaksi",
  "/admin/transaction/edit": "Edit Trannsaksi",

  "/admin/bill": "Kelola Tagihan",
  "/admin/bill/change": "Ubah Data Tagihan",

  "/admin/log": "Aktivitas Pengurus",

  "/admin/report": "Report Bulanan"
}

const getRouteWithoutParams = (
  route: string,
  params: { [key: string]: string | string[] },
) => {
  if (route.length > 0) {
    for (const key in params) {
      let param = params[key]
      if (typeof param === "string") {
        route = route.replace(`/${param}`, "")
      } else {
        param.forEach((value) => {
          route = route.replace(`/${value}`, "")
        })
      }
    }
  }

  return route
}

const Navbar = () => {
  const currentRoute = usePathname()
  const params = useParams()

  // State untuk mengatur apakah sidebar ditampilkan atau tidak
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fungsi untuk menampilkan atau menyembunyikan sidebar
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="flex shadow-md bg-white sticky top-0 justify-between items-center p-6 z-50">
      <button
        className="lg:hidden"
        onClick={toggleMenu}
      >
        <Icons.Menu className="text-primary" />
      </button>
      <h4 className="text-primary">
        {pageName[getRouteWithoutParams(currentRoute, params)]}
      </h4>
      <LogoutDialog className="lg:hidden" />

      {/* Sidebar menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-primary text-white/40 shadow-lg z-50 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <Icons.X className="text-white" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
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
      </div>
    </nav>
  )
}

export default Navbar
