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
    useAuth(req);

    const announcement = await db().query.Announcement.findFirst({
      where: eq(Announcement.id, params.id),
    });
    if (!announcement?.storageId)
      return sendErrors(404, { message: "Attachment not found" });

    const storage = await db().query.Storage.findFirst({
      where: eq(Storage.id, announcement.storageId),
    });

    if (!storage) {
      return sendErrors(404, { message: "Announcement not found" });
    }

    try {
      const fileRef = await getFile(storage);

      // Attempt to download the file
      const [fileBuffer] = await fileRef.download();
      const contentType = fileRef.metadata.contentType || "application/octet-stream";

      // Check if the file buffer is valid
      if (!fileBuffer) {
        return sendErrors(500, { message: "File download failed" });
      }

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${storage.name}${storage.ext}"`,
        },
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      return sendErrors(500, { message: "An error occurred while fetching the file." });
    }
  }
);
