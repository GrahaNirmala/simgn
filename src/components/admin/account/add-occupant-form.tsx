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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { occupantRoleType, occupantRoleTypes } from "@/lib/constants"
import { HouseResponse } from "@/server/models/responses/house"
import { useState } from "react"
import { normalizePhone } from "@/lib/utils"
import { addOccupantFormSchema } from "@/lib/schema"
import { postOccupant } from "@/lib/api"
import { useRouter } from "next/navigation"

const formSchema = addOccupantFormSchema

export function AddOccupantForm({ houses }: { houses: HouseResponse[] }) {
  const router = useRouter()
  const [filteredHouses, setFilteredHouses] = useState(
    filterHouses(occupantRoleTypes[0].key as occupantRoleType),
  )

  function filterHouses(type: occupantRoleType) {
    return houses.filter((house) => {
      switch (type) {
        case "owner":
          return house.owner === null

        case "renter":
          return house.renter === null
      }
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: occupantRoleTypes[0].key,
      house_id: -1,
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onChangeRoleType(type: occupantRoleType) {
    setFilteredHouses(filterHouses(type))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const [_, errors] = await postOccupant(values)

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

    router.replace("/admin/account")
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
              <Select
                onValueChange={(value) => {
                  onChangeRoleType(value as occupantRoleType)
                  return field.onChange(value)
                }}
                defaultValue={occupantRoleTypes[0].key}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {occupantRoleTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.name}
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
          name="house_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rumah</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredHouses
                    .sort((a, b) => a.id - b.id)
                    .map((house) => (
                      <SelectItem key={house.id} value={house.id.toString()}>
                        {house.code}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim())
                    return field.onBlur
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Telp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onBlur={(e) => {
                    field.onChange(normalizePhone(e.target.value))
                    return field.onBlur
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={form.formState.isSubmitting} type="submit">
          Tambah
        </LoadingButton>
      </form>
    </Form>
  )
}
