CREATE TABLE IF NOT EXISTS "log_activity" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"author_id" bigint NOT NULL,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "announcement" ADD COLUMN "storage_id" bigint NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcement" ADD CONSTRAINT "announcement_storage_id_storage_id_fk" FOREIGN KEY ("storage_id") REFERENCES "storage"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "family" DROP COLUMN IF EXISTS "religion";--> statement-breakpoint
ALTER TABLE "family" DROP COLUMN IF EXISTS "education";--> statement-breakpoint
ALTER TABLE "family" DROP COLUMN IF EXISTS "job_type";--> statement-breakpoint
ALTER TABLE "family" DROP COLUMN IF EXISTS "father_name";--> statement-breakpoint
ALTER TABLE "family" DROP COLUMN IF EXISTS "mother_name";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_activity" ADD CONSTRAINT "log_activity_author_id_staff_id_fk" FOREIGN KEY ("author_id") REFERENCES "staff"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
