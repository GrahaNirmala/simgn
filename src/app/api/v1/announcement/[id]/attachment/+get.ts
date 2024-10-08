import { db } from "@/server/db";
import { Announcement, Storage } from "@/server/db/schema";
import { useAuth } from "@/server/security/auth";
import { getFile } from "@/server/storage";
import { defineHandler } from "@/server/web/handler";
import { sendErrors } from "@/server/web/response";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    try {
      useAuth(req);

      const announcement = await db().query.Announcement.findFirst({
        where: eq(Announcement.id, params.id),
      });

      if (!announcement?.storageId) {
        return sendErrors(404, { message: "Attachment not found" });
      }

      const storage = await db().query.Storage.findFirst({
        where: eq(Storage.id, announcement.storageId),
      });

      if (!storage) {
        return sendErrors(404, { message: "Announcement not found" });
      }

      const fileRef = await getFile(storage);
      const [fileBuffer] = await fileRef.download();

      return new NextResponse(fileBuffer)
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching announcement attachment:", error);

      // Return a 500 Internal Server Error with error details
      return sendErrors(500, { message: "Internal server error" });
    }
  }
);
