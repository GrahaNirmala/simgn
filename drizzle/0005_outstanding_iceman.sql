DROP TABLE "announcement_category";--> statement-breakpoint
ALTER TABLE "announcement" DROP CONSTRAINT "announcement_announcement_category_id_announcement_category_id_fk";
--> statement-breakpoint
ALTER TABLE "announcement" DROP COLUMN IF EXISTS "announcement_category_id";