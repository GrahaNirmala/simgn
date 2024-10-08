CREATE TABLE IF NOT EXISTS "announcement_category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "announcement_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "announcement" ADD COLUMN "announcement_category_id" bigint NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcement" ADD CONSTRAINT "announcement_announcement_category_id_announcement_category_id_fk" FOREIGN KEY ("announcement_category_id") REFERENCES "announcement_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
