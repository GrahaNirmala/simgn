"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import Image from "next/image";
import { LoadingButton } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AnnouncementResponse } from "@/server/models/responses/announcement"
import { StaffResponse } from "@/server/models/responses/staff"
import { Textarea } from "@/components/ui/textarea"
import { postAnnouncement, putAnnouncement } from "@/lib/api"
import { useRouter } from "next/navigation"
import { StorageResponse } from "@/server/models/responses/storage";

const formSchema = z.object({
  title: z.string().nonempty("Judul harus diisi"),
  content: z.string().nonempty("Konten harus diisi"),
  attachment: z.any().optional(),
})

export function AnnouncementForm({
  announcement,
  storage,
}: {
  announcement?: AnnouncementResponse
  storage?: StorageResponse
}) {
  const router = useRouter()
  const defaultValues = {
    title: announcement?.title ?? "",
    content: announcement?.content ?? "",
    author_id: announcement?.author_id ?? -1,
    attachment: null,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("content", values.content)
    
    if (values.attachment && values.attachment.length > 0) {
      formData.append("file", values.attachment[0])
    }

    let response
    let errors

    if (announcement) {
      [response, errors] = await putAnnouncement(announcement.id.toString(), formData)
    } else {
      [response, errors] = await postAnnouncement(formData)
    }

    if (errors) {
      errors.forEach((error) => {
        if (error.field) {
          form.setError(error.field as any, {
            type: "server",
            message: error.message,
          })
        }
      })
      return
    }

    router.replace("/admin/announcement")
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {announcement?.storage_id ? (
          <div className="mb-4">
            <div>
              <FormLabel>Lampiran Saat Ini</FormLabel>
            </div>
            {storage ? (
              <div className="w-32 h-32 overflow-hidden">
                <img
                  alt="Lampiran"
                  src={`/api/v1/announcement/${announcement.id}/attachment`}
                  width={50}
                  height={50}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                />
              </div>
            ) : (
              <div>
                <span>Tidak ada lampiran</span>
              </div>
            )}
          </div>
        ) : (
          <span></span>
        )}
        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Lampiran (Opsional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files
                    if (files) {
                      field.onChange(files)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          {announcement ? "Edit" : "Tambah"}
        </LoadingButton>
      </form>
    </Form>
  )
}
