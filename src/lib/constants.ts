export const routeNames = {
  dashboard: "/app/dashboard",
  transaction: "/app/transaction",
  bill: "/app/bill",
  profile: "/app/profile",
}

export const adminRouteNames = {
  account: "/admin/account",
  house: "/admin/house",
  announcement: "/admin/announcement",
  transaction: "/admin/transaction",
  bill: "/admin/bill",
  log: "/admin/log",
}

export const roleValue: { [key: string]: string } = {
  owner: "Pemilik",
  renter: "Penyewa",
  admin: "Admin",
  treasurer: "Bendahara",
  secretary: "Sekretaris",
  security_guard: "Security",
}

export type staffRoleType =
  | "admin"
  | "secretary"
  | "treasurer"
  | "security_guard"

export const staffRoleTypes: readonly {
  key: staffRoleType
  name: string
}[] = [
  { key: "admin", name: "Admin" },
  { key: "treasurer", name: "Bendahara" },
  { key: "secretary", name: "Sekretaris" },
  { key: "security_guard", name: "Security" },
]

export type occupantRoleType = "owner" | "renter"

export const occupantRoleTypes: readonly {
  key: occupantRoleType
  name: string
}[] = [
  { key: "owner", name: "Pemilik" },
  { key: "renter", name: "Penyewa" },
]

type errorKeyType =
  | "house_taken"
  | "email_registered"
  | "phone_registered"
  | "house_not_found"
  | "occupant_not_found"
  | "occupant_not_found_auth"
  | "phone_not_registered"
  | "password_incorrect"
  | "house_code_registered"
  | "staff_not_found"
  | "announcement_not_found"
  | "announcement_category_exist"
  | "announcement_category_not_found"
  | "billing_not_found"
  | "invalid_refresh_token"
  | "password_old_incorrect"
  | "family_not_found"

export const errorDefinition: {
  [key in errorKeyType]: { field?: string; message: string }
} = {
  house_not_found: {
    message: "Rumah tidak ada",
  },
  invalid_refresh_token: {
    message: "Token Tidak Valid",
  },
  house_taken: {
    field: "house_id",
    message: "Rumah sudah diisi",
  },
  email_registered: {
    field: "email",
    message: "Email sudah terdaftar",
  },
  phone_registered: {
    field: "phone",
    message: "No. Telp sudah terdaftar",
  },
  occupant_not_found: {
    message: "Penghuni tidak ditemukan",
  },
  occupant_not_found_auth: {
    field: "phone",
    message: "Penghuni dengan No. Telp ini belum terdaftar",
  },
  phone_not_registered: {
    field: "phone",
    message: "No. Telp belum terdaftar",
  },
  password_incorrect: {
    field: "password",
    message: "Password salah",
  },
  password_old_incorrect:{
    message: "Password Sebelumnya salah",
  },
  house_code_registered: {
    field: "code",
    message: "Kode rumah sudah terdaftar",
  },
  staff_not_found: {
    message: "Staf tidak ditemukan",
  },
  family_not_found: {
    message: "Anggota Keluarga tidak ditemukan",
  },
  announcement_not_found: {
    message: "Pengumuman tidak ditemukan",
  },
  announcement_category_exist: {
    field: "name",
    message: "Kategori pengumuman sudah ada",
  },
  announcement_category_not_found: {
    message: "Kategori pengumuman tidak ditemukan",
  },
  billing_not_found: {
    message: "Tagihan tidak ditemukan",
  },
}

export const genderTypes = ["laki-laki", "perempuan"] as const

export const religionTypes = [
  "islam",
  "kristen",
  "hindu",
  "budha",
  "katolik",
  "konghucu",
] as const

export const maritalStatusTypes = [
  "belum kawin",
  "kawin",
  "cerai hidup",
  "cerai mati",
] as const

export const relationshipStatusTypes = [
  "kepala keluarga",
  "suami",
  "istri",
  "anak",
  "menantu",
  "cucu",
  "orangtua",
  "mertua",
  "famili lain",
  "pembantu",
  "lainnya",
] as const
