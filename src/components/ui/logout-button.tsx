"use client"

import { usePathname, useRouter } from "next/navigation"
import { FC, useState } from "react"

import { ButtonProps, LoadingButton } from "./button"
import { logout } from "@/lib/api"

export const LogoutButton: FC<ButtonProps> = ({ ...props }) => {
  const router = useRouter()
  const isAdmin = usePathname().includes("admin")
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout()
      isAdmin ? router.replace("/admin/login") : router.replace("/login")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      loading={loading}
      variant={"destructive"}
      onClick={handleLogout}
      {...props}
    >
      Keluar
    </LoadingButton>
  )
}

export default LogoutButton
