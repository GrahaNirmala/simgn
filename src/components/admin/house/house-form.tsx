"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"

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
import { postHouse, putHouse } from "@/lib/api"
import { HouseResponse } from "@/server/models/responses/house"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  code: z.string().nonempty("Kode harus diisi"),
  address: z.string().nonempty("Alamat harus diisi"),
})

export function HouseForm({ house }: { house?: HouseResponse }) {
  const router = useRouter()
  const defaultValues = house

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    if (house) {
      const [_, errors] = await putHouse(house.id.toString(), values)

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
    } else {
      const [_, errors] = await postHouse(values)

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
    }

    router.replace("/admin/house")
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kav.</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Penghuni Sesuai KTP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          {house ? "Edit" : "Tambah"}
        </LoadingButton>
      </form>
    </Form>
  )
}
