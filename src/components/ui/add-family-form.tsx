"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { LoadingButton } from "./button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form"
import { Input } from "./input"
import { postFamilyMember } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { DateInput } from "./date-input"

import {
  genderTypes,
  maritalStatusTypes,
  relationshipStatusTypes,
  religionTypes,
} from "@/lib/constants"
import { familySchema } from "@/lib/schema"
import { FamilyResponse } from "@/server/models/responses/family"

const formSchema = familySchema

export function AddFamilyForm({
  occupantId,
  familyMember,
}: {
  occupantId: string
  familyMember?: FamilyResponse
}) {
  const router = useRouter()

  const defaultValues = familyMember

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues && familySchema.parse(defaultValues),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (familyMember) {
      // const [_, errors] = await putFamily(familyMember.id, values)
      // if (errors) {
      //   errors.forEach((error) => {
      //     if (error.field) {
      //       form.setError(error.field as any, {
      //         type: "server",
      //         message: error.message,
      //       })
      //     }
      //   })
      //   return
      // }
    } else {
      const [_, errors] = await postFamilyMember(occupantId, values)

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

    router.refresh()
    router.replace(`/admin/account/occupant/${occupantId}/family`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identity_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={defaultValues?.gender}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genderTypes.map((genderType, idx) => (
                    <SelectItem key={idx} value={genderType}>
                      {genderType.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthplace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat Lahir</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lahir (Tanggal/Bulan/Tahun)</FormLabel>
              <FormControl>
                <DateInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="religion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agama</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={defaultValues?.religion}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {religionTypes.map((religionType, idx) => (
                    <SelectItem key={idx} value={religionType}>
                      {religionType.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Pekerjaan</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Perkawinan</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={defaultValues?.marital_status}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maritalStatusTypes.map((maritalStatusType, idx) => (
                    <SelectItem key={idx} value={maritalStatusType}>
                      {maritalStatusType.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Hubungan Dalam Keluarga</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={defaultValues?.relationship_status}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationshipStatusTypes.map(
                    (relationshipStatusType, idx) => (
                      <SelectItem key={idx} value={relationshipStatusType}>
                        {relationshipStatusType.toUpperCase()}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          {familyMember ? "Edit" : "Tambah"}
        </LoadingButton>
      </form>
    </Form>
  )
}
