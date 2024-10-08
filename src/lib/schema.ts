import * as z from "zod"
import {
  genderTypes,
  maritalStatusTypes,
  relationshipStatusTypes,
  religionTypes,
} from "./constants"

const userBaseSchema = {
  name: z.string().nonempty("Nama harus diisi"),
  phone: z
    .string()
    .nonempty("No. Telp harus diisi")
    .regex(new RegExp(/^(08[1-9][0-9]{7,10}|0274[0-9]{6,10})$/), "No. Telp tidak valid"),
  email: z
    .string()
    .optional()
    .transform((value) => value || undefined)
    .pipe(z.string().email().optional()),
}

export const addOccupantFormSchema = z
  .object({
    ...userBaseSchema,
    role: z.enum(["owner", "renter"]),
    house_id: z.coerce.number().nonnegative("Rumah harus diisi"),
    password: z
      .string()
      .nonempty("Password harus diisi")
      .min(8, "Minimal 8 karakter"),
    confirmPassword: z.string().nonempty("Konfirmasi password harus diisi"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

export const editOccupantFormSchema = z.object({
  ...userBaseSchema,
  role: z.enum(["owner", "renter"]),
  house_id: z.coerce.number().nonnegative("Rumah harus diisi"),
})

export const addStaffFormSchema = z
  .object({
    ...userBaseSchema,
    role: z.enum(["admin", "secretary", "treasurer", "security_guard"]),
    password: z
      .string()
      .nonempty("Password harus diisi")
      .min(8, "Minimal 8 karakter"),
    confirmPassword: z.string().nonempty("Konfirmasi password harus diisi"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

export const editStaffFormSchema = z.object({
  ...userBaseSchema,
  role: z.enum(["admin", "secretary", "treasurer", "security_guard"]),
})

export const familySchema = z.object({
  name: z.string().nonempty("Name harus diisi"),
  identity_number: z.string().nonempty("No. Identitas harus diisi"),
  birthday: z.string().nonempty("Tanggal Lahir harus diisi"),
  gender: z.enum(genderTypes),
  birthplace: z.string().nonempty("Tempat lahir harus diisi"),
  religion: z.enum(religionTypes),
  job_type: z.string().optional(),
  marital_status: z.enum(maritalStatusTypes),
  relationship_status: z.enum(relationshipStatusTypes),
})
