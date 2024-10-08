"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, LoadingButton } from "@/components/ui/button"
import { deleteAnnouncement, deleteHouse, deleteOccupant, deleteStaff } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Domain =
  | "occupant"
  | "staff"
  | "house"
  | "announcement"
  | "transaction"
  | "family"

export default function DeleteAlertDialog({
  message,
  domain,
  id,
}: {
  message: string
  domain: Domain
  id: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      switch (domain) {
        case "occupant":
          await deleteOccupant(id)
          break

        case "staff":
          await deleteStaff(id)
          break

        case "house":
          await deleteHouse(id)
          break

        case "announcement":
          await deleteAnnouncement(id)
          break

        case "transaction":
          break

        case "family":
          break
      }
    } finally {
      setLoading(false)
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            loading={loading}
            onClick={handleDelete}
          >
            Hapus
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
