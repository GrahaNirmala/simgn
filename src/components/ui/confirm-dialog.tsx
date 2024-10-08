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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { payBill, payBillCash } from "@/lib/api"
import { BillingResponse } from "@/server/models/responses/billing"
import { toast } from "sonner"

export default function PayBillAlertDialog({
  bill,
  occupantId,
}: {
  bill: BillingResponse
  occupantId?: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      if (occupantId) {
        const [_, _err] = await payBillCash(bill.id, {
          occupant_id: occupantId,
        })
        toast.success("Pembayaran berhasil")
      } else {
        const [payment, _err] = await payBill(bill.id)

        if (payment.redirectUrl) {
          window.open(payment.redirectUrl, "_blank")
        } else {
          toast.error("Tautan pembayaran gagal dibuka, silahkan coba bayar lagi")
        }
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
        <Button variant="secondary" size="sm">
          Bayar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin membayar tagihan sebesar{" "}
            {bill.amount + (bill.extra_charge || 0)}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <LoadingButton
            variant="secondary"
            loading={loading}
            onClick={handlePay}
          >
            Bayar
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
