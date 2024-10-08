import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  bigserial,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  json,
} from "drizzle-orm/pg-core"

const Timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
}

export const StaffRole = pgEnum("staff_role", [
  "admin",
  "secretary",
  "treasurer",
  "security_guard",
])
export const Staff = pgTable("staff", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  role: StaffRole("role").notNull(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique().notNull(),
  password: text("password").notNull(),
  ...Timestamps,
})
export type TStaff = InferSelectModel<typeof Staff>
export type TInsertStaff = InferInsertModel<typeof Staff>


export const Announcement = pgTable("announcement", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: bigint("author_id", { mode: "number" })
    .notNull()
    .references(() => Staff.id),
  storageId: bigint("storage_id", { mode: "number" })
    .references(() => Storage.id),
  ...Timestamps,
})
export const announcementRelations = relations(Announcement, ({ one }) => ({
  author: one(Staff, {
    fields: [Announcement.authorId],
    references: [Staff.id],
  }),
  storage: one(Storage, {
    fields: [Announcement.storageId],
    references: [Storage.id],
  })
}))
export type TAnnouncement = InferSelectModel<typeof Announcement>
export type TInsertAnnouncement = InferInsertModel<typeof Announcement>

export const House = pgTable("house", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: text("code").unique().notNull(),
  address: text("address").notNull(),
  ...Timestamps,
})
export type THouse = InferSelectModel<typeof House>
export type TInsertHouse = InferInsertModel<typeof House>

export type DataFamilyCard = {
  noFamilyCard: string;
  nameHeadFamily: string;
  addressCard: string;
  rtRwCard: string;
  desaCard: string;
  kecamatanCard: string;
  kabupatenCard: string;
  posCodeCard: string;
  provinsiCard: string;
}

export const OccupantRole = pgEnum("occupant_role", ["owner", "renter"])
export const Occupant = pgTable("occupant", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  role: OccupantRole("role").notNull(),
  houseId: bigint("house_id", { mode: "number" })
    .notNull()
    .references(() => House.id),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone").unique().notNull(),
  password: text("password").notNull(),
  familyCard: json("family_card").$type<DataFamilyCard>(),
  ...Timestamps,
})

export const DeviceToken = pgTable("device_token",{
  id: bigserial("id", {mode: "number"}).primaryKey(),
  occupantId: bigint("occupant_id",{mode:"number"})
    .notNull()
    .references(()=>Occupant.id),
  deviceToken: text("device_token").unique(),
  ...Timestamps,
})
export type TDeviceToken = InferSelectModel<typeof DeviceToken>
export type TInsertDeviceToken = InferInsertModel<typeof DeviceToken>

export const occupantRelations = relations(Occupant, ({ one }) => ({
  occupantDocument: one(OccupantDocument, {
    fields: [Occupant.id],
    references: [OccupantDocument.occupantId],
  }),
}))
export type TOccupant = InferSelectModel<typeof Occupant>
export type TInsertOccupant = InferInsertModel<typeof Occupant>

export const Gender = pgEnum("gender", ["laki-laki", "perempuan"])

export const Family = pgTable("family", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  occupantId: bigint("occupant_id", { mode: "number" })
    .notNull()
    .references(() => Occupant.id),
  name: text("name").notNull(),
  identityNumber: text("identity_number").unique().notNull(),
  birthday: timestamp("birthday").notNull(),
  gender: Gender("gender").notNull(),
  religion: text("religion").notNull(),
  job_type: text("job_type"),
  birthplace: text("birthplace").notNull(),
  maritalStatus: text("marital_status").notNull(),
  relationshipStatus: text("relationship_status").notNull(),
  ...Timestamps,
})
export type TFamily = InferSelectModel<typeof Family>
export type TInsertFamily = InferInsertModel<typeof Family>

export const Billing = pgTable("billing", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  houseId: bigint("house_id", { mode: "number" })
    .notNull()
    .references(() => House.id),
  period: timestamp("period", { withTimezone: true }).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  isPaid: boolean("is_paid").notNull(),
  extraCharge: bigint("extra_charge", { mode: "number" }),
  ...Timestamps,
})
export type TBilling = InferSelectModel<typeof Billing>
export type TInsertBilling = InferInsertModel<typeof Billing>

export const BillingConfig = pgTable("billing_config",{
  id: bigserial("id", {mode: "number"}).primaryKey(),
  amountBill: bigint("amount_bill", {mode: "number"}).notNull(),
  extraChargeBill: bigint("extra_charge_bill", {mode: "number"}),
  ...Timestamps,
})
export type TbillingConfig = InferSelectModel<typeof BillingConfig>
export type TInsertBillingConfig = InferInsertModel<typeof BillingConfig>


export const PaymentMode = pgEnum("payment_mode", ["transfer", "cash"])
export const PaymentStatus = pgEnum("payment_status", [
  "pending",
  "capture",
  "settlement",
  "deny",
  "cancel",
  "expire",
  "failure",
  "refund",
  "chargeback",
  "partial_refund",
  "partial_chargeback",
  "authorize",
])
export const Payment = pgTable("payment", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  billingId: bigint("billing_id", { mode: "number" })
    .notNull()
    .references(() => Billing.id),
  amount: bigint("amount", { mode: "number" }).notNull(),
  payerId: bigint("payer_id", { mode: "number" })
    .notNull()
    .references(() => Occupant.id),
  invoice: text("invoice"),
  token: text("token"),
  mode: text("mode").notNull(),
  status: PaymentStatus("status").notNull(),
  tanggalBilling: timestamp("tanggalBilling", {withTimezone: true}),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  redirectUrl: text("redirect_url"),
  ...Timestamps,
})
export type TPayment = InferSelectModel<typeof Payment>
export type TInsertPayment = InferInsertModel<typeof Payment>

export const CashflowMovement = pgEnum("cashflow_movement", [
  "income",
  "outcome",
])
export const Cashflow = pgTable("cashflow", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  authorId: bigint("author_id", { mode: "number" })
    .notNull()
    .references(() => Staff.id),
  amount: bigint("amount", { mode: "number" }).notNull(),
  movement: CashflowMovement("movement").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  storageId: bigint("storage_id", { mode: "number" })
  .references(() => Storage.id),
  ...Timestamps,
})

export const CashFlowDocumentType = pgEnum("cashflow_document_type", [
  "receipt",
])
export const CashFlowDocument = pgTable("cashflow_document", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  type: CashFlowDocumentType("type").notNull(),
  cashFlowId: bigint("cashflow_id", { mode: "number" })
    .notNull()
    .references(() => Cashflow.id),
  storageId: bigint("storage_id", { mode: "number" })
    .notNull()
    .references(() => Storage.id),
  ...Timestamps,
})

export const cashflowRelations = relations(CashFlowDocument, ({ one }) => ({
  storage: one(Storage, {
    fields: [CashFlowDocument.storageId],
    references: [Storage.id],
  }),
}))

export type TCashFlowDocument = InferSelectModel<typeof CashFlowDocument>
export type TInsertCashFlowDocument = InferInsertModel<typeof CashFlowDocument>

export type TCashflow = InferSelectModel<typeof Cashflow>
export type TInsertCashflow = InferInsertModel<typeof Cashflow>

export const Storage = pgTable("storage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  ext: text("ext").notNull(),
  token: uuid("token").unique().defaultRandom().notNull(),
  ...Timestamps,
})
export type TStorage = InferSelectModel<typeof Storage>
export type TInsertStorage = InferInsertModel<typeof Storage>

export const OccupantDocumentType = pgEnum("occupant_document_type", [
  "family_card",
])
export const OccupantDocument = pgTable("occupant_document", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  type: OccupantDocumentType("type").notNull(),
  occupantId: bigint("occupant_id", { mode: "number" })
    .notNull()
    .references(() => Occupant.id),
  storageId: bigint("storage_id", { mode: "number" })
    .notNull()
    .references(() => Storage.id),
  ...Timestamps,
})
export const occupantDocumentRelations = relations(
  OccupantDocument,
  ({ one }) => ({
    occupant: one(Occupant, {
      fields: [OccupantDocument.occupantId],
      references: [Occupant.id],
    }),
    storage: one(Storage, {
      fields: [OccupantDocument.storageId],
      references: [Storage.id],
    }),
  }),
)
export type TOccupantDocument = InferSelectModel<typeof OccupantDocument>
export type TInsertOccupantDocument = InferInsertModel<typeof OccupantDocument>

export const LogActivity = pgTable("log_activity",{
  id: bigserial("id", {mode: "number"}).primaryKey(),
  authorId: bigint("author_id", { mode: "number" })
  .notNull()
  .references(() => Staff.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  details: text("details").notNull(),
  ...Timestamps,
})

export const LogActivityRelations = relations(LogActivity, ({ one }) => ({
  author: one(Staff, {
    fields: [LogActivity.authorId],
    references: [Staff.id],
  }),
}))
export type TLogActivity = InferSelectModel<typeof LogActivity>
export type TInsertLogActivity = InferInsertModel<typeof LogActivity>