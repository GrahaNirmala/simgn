"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, LoadingButton } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Icons from "@/components/ui/icons"
import { uploadFamilyCard } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Resolver, useForm } from "react-hook-form"

type FormSchema = {
  familyCard: FileList
}

export default function FamilyCardDialog({
  occupantId,
}: {
  occupantId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const resolver: Resolver<FormSchema> = async (values) => {
    return {
      values: values.familyCard.length > 0 ? values : {},
      errors:
        values.familyCard.length === 0
          ? {
              familyCard: {
                type: "required",
                message: "Kartu Keluarga harus diisi",
              },
            }
          : {},
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({ resolver })

  async function onSubmit(data: FormSchema) {
    const formData = new FormData()
    formData.append("file", data.familyCard[0])

    const [_storage, _errors] = await uploadFamilyCard(occupantId, formData)

    toast.success("Kartu Keluarga berhasil diunggah")
    setOpen(false)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.Plus size={14} className="mr-1" />
          Unggah Kartu Keluarga
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Upload Kartu Keluarga</AlertDialogTitle>
            <div className="text-start">
              <Label
                className={errors.familyCard && "text-destructive"}
                htmlFor="categoryName"
              >
                File Kartu Keluarga (format file: .jpeg/.png/.jpg)
              </Label>
              <Input
                type="file"
                accept=".png,.jpeg,.jpg"
                {...register("familyCard")}
              />
              {errors.familyCard && (
                <p className={`text-sm font-medium text-destructive`}>
                  {errors.familyCard.message}
                </p>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <LoadingButton loading={isSubmitting} type="submit">
              Upload
            </LoadingButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
