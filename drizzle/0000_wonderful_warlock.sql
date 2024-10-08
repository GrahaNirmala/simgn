DO $$ BEGIN
 CREATE TYPE "cashflow_document_type" AS ENUM('receipt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "cashflow_movement" AS ENUM('income', 'outcome');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('laki-laki', 'perempuan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "occupant_document_type" AS ENUM('family_card');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "occupant_role" AS ENUM('owner', 'renter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_mode" AS ENUM('transfer', 'cash');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('pending', 'capture', 'settlement', 'deny', 'cancel', 'expire', 'failure', 'refund', 'chargeback', 'partial_refund', 'partial_chargeback', 'authorize');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "staff_role" AS ENUM('admin', 'secretary', 'treasurer', 'security_guard');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "announcement" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"announcement_category_id" bigint NOT NULL,
	"author_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "announcement_category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "announcement_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"house_id" bigint NOT NULL,
	"period" timestamp with time zone NOT NULL,
	"amount" bigint NOT NULL,
	"is_paid" boolean NOT NULL,
	"extra_charge" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing_config" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"amount_bill" bigint NOT NULL,
	"extra_charge_bill" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cashflow_document" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" "cashflow_document_type" NOT NULL,
	"cashflow_id" bigint NOT NULL,
	"storage_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cashflow" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"author_id" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"movement" "cashflow_movement" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"storage_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "device_token" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"occupant_id" bigint NOT NULL,
	"device_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "device_token_device_token_unique" UNIQUE("device_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "family" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"occupant_id" bigint NOT NULL,
	"name" text NOT NULL,
	"identity_number" text NOT NULL,
	"birthday" timestamp NOT NULL,
	"gender" "gender" NOT NULL,
	"birthplace" text NOT NULL,
	"religion" text NOT NULL,
	"education" text,
	"job_type" text,
	"marital_status" text NOT NULL,
	"relationship_status" text NOT NULL,
	"father_name" text NOT NULL,
	"mother_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "family_identity_number_unique" UNIQUE("identity_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "house" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "house_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occupant" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role" "occupant_role" NOT NULL,
	"house_id" bigint NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"family_card" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "occupant_email_unique" UNIQUE("email"),
	CONSTRAINT "occupant_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occupant_document" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" "occupant_document_type" NOT NULL,
	"occupant_id" bigint NOT NULL,
	"storage_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"billing_id" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"payer_id" bigint NOT NULL,
	"invoice" text,
	"token" text,
	"mode" "payment_mode" NOT NULL,
	"status" "payment_status" NOT NULL,
	"tanggalBilling" timestamp with time zone,
	"expired_at" timestamp with time zone,
	"redirect_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"role" "staff_role" NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "staff_email_unique" UNIQUE("email"),
	CONSTRAINT "staff_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ext" text NOT NULL,
	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "storage_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcement" ADD CONSTRAINT "announcement_announcement_category_id_announcement_category_id_fk" FOREIGN KEY ("announcement_category_id") REFERENCES "announcement_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcement" ADD CONSTRAINT "announcement_author_id_staff_id_fk" FOREIGN KEY ("author_id") REFERENCES "staff"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_house_id_house_id_fk" FOREIGN KEY ("house_id") REFERENCES "house"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cashflow_document" ADD CONSTRAINT "cashflow_document_cashflow_id_cashflow_id_fk" FOREIGN KEY ("cashflow_id") REFERENCES "cashflow"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cashflow_document" ADD CONSTRAINT "cashflow_document_storage_id_storage_id_fk" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cashflow" ADD CONSTRAINT "cashflow_author_id_staff_id_fk" FOREIGN KEY ("author_id") REFERENCES "staff"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cashflow" ADD CONSTRAINT "cashflow_storage_id_storage_id_fk" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "device_token" ADD CONSTRAINT "device_token_occupant_id_occupant_id_fk" FOREIGN KEY ("occupant_id") REFERENCES "occupant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "family" ADD CONSTRAINT "family_occupant_id_occupant_id_fk" FOREIGN KEY ("occupant_id") REFERENCES "occupant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occupant" ADD CONSTRAINT "occupant_house_id_house_id_fk" FOREIGN KEY ("house_id") REFERENCES "house"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occupant_document" ADD CONSTRAINT "occupant_document_occupant_id_occupant_id_fk" FOREIGN KEY ("occupant_id") REFERENCES "occupant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occupant_document" ADD CONSTRAINT "occupant_document_storage_id_storage_id_fk" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_billing_id_billing_id_fk" FOREIGN KEY ("billing_id") REFERENCES "billing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_payer_id_occupant_id_fk" FOREIGN KEY ("payer_id") REFERENCES "occupant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
