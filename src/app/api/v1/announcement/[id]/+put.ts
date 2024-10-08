import { errorDefinition } from "@/lib/constants"
import { db } from "@/server/db"
import { admin } from "@/server/security/firebase";
import { Announcement, DeviceToken } from "@/server/db/schema"
import { toAnnouncementResponse } from "@/server/models/responses/announcement"
import { getCurrentStaff, useAuth } from "@/server/security/auth"
import { defineHandler } from "@/server/web/handler"
import { sendData, sendErrors } from "@/server/web/response"
import { eq } from "drizzle-orm"
import { logActivity } from "@/server/utils/logging";
import { uploadFile } from "@/server/storage";

type DeviceTokenType = {
  device_token: string | null;
};

export const PUT = defineHandler(
  async (req, { params }: { params: { id: number } }) => {
    useAuth(req, {
      staff: ["admin", "secretary"],
    })
    const staff = await getCurrentStaff(req)

    const formData = await req.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const file = formData.get("file") as File | null

    if (!title || !content) {
      return sendErrors(400, { message: "Required fields are missing or invalid" });
    }
    
    let announcement = await db().query.Announcement.findFirst({
      where: eq(Announcement.id, params.id),
    });
    
    if (!announcement) {
      return sendErrors(404, errorDefinition.announcement_not_found);
    }

    let storageId: number | null = announcement.storageId;

    if (file) {
      try {
        console.log("Uploading file...");
        const storage = await uploadFile(file);
        storageId = storage.id;
        console.log("File uploaded successfully with storage ID:", storageId);
      } catch (error) {
        console.error("Error uploading file:", error);
        return sendErrors(500, { message: "Error uploading file" });
      }
    }

    announcement.title = title;
    announcement.content = content;
    announcement.authorId = staff.id;
    announcement.storageId = storageId;

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;

    await logActivity(
      staff.id,
      "Pengumuman",
      "Mengubah",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Mengubah pengumuman dengan judul ${title}`,
    );

    await db()
      .update(Announcement)
      .set(announcement)
      .where(eq(Announcement.id, params.id));

    const deviceTokens = await db()
      .select({device_token: DeviceToken.deviceToken })
      .from(DeviceToken)
      .execute() as DeviceTokenType[];

    const validTokens = deviceTokens
      .map((token) => token.device_token)
      .filter((token): token is string => token !== null && token !== undefined);

    const message = {
      android: {
        notification: {
            clickAction: 'OPEN_NOTIFICATION',
        },
        data:{
          notification_id: announcement.id.toString(),
          storageId: storageId ? storageId.toString() : "",
        }
      },
      notification: {
        title: title,
        body: content,
      },
      data: {
        title: title,
        body: content,
        notification_id: announcement.id.toString(),
        storageId: storageId ? storageId.toString() : "",
      },
      tokens: validTokens,
    };
    
    await admin.messaging().sendEachForMulticast(message);
    
    return sendData(201, toAnnouncementResponse(announcement));
  }
);
