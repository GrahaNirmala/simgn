import { db } from "@/server/db";
import { Announcement, DeviceToken, TInsertAnnouncement } from "@/server/db/schema";
import { toAnnouncementResponse } from "@/server/models/responses/announcement";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { defineHandler } from "@/server/web/handler";
import { sendData, sendErrors } from "@/server/web/response";
import { uploadFile } from "@/server/storage";  // Add the file upload function
import { logActivity } from "@/server/utils/logging";
import { admin } from "@/server/security/firebase";

type DeviceTokenType = {
  device_token: string | null;
};

export const POST = defineHandler(async (req) => {
  try {
    useAuth(req, {
      staff: ["admin", "secretary"],
    });

    const staff = await getCurrentStaff(req);

    const formData = await req.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const file = formData.get("file")

    if (!title || !content) {
      return sendErrors(400, { message: "Required fields are missing or invalid" });
    }

    let storageId: number | null = null;

    if (file) {
      const storage = await uploadFile(file as File);
      storageId = storage.id;
    }

    const announcement: TInsertAnnouncement = {
      title: title,
      content: content,
      storageId: storageId,
      authorId: staff.id,
    };

    const [newAnnouncement] = await db()
      .insert(Announcement)
      .values(announcement)
      .returning();

    const deviceTokens = await db()
      .select({ device_token: DeviceToken.deviceToken })
      .from(DeviceToken)
      .execute() as DeviceTokenType[];

    const validTokens = deviceTokens.map((token) => token.device_token).filter((token): token is string => token !== null);

    const formattedRole = staff.role === "secretary" 
      ? "sekretaris" 
      : staff.role === "treasurer" 
      ? "bendahara" 
      : staff.role;
    await logActivity(
      staff.id,
      "Pengumuman",
      "Menambahkan",
      `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Menambahkan pengumuman dengan judul ${title}`,
    );

    const message = {
      android: {
        notification: {
            title: title,
            body: content,
            clickAction: 'OPEN_NOTIFICATION',
        },
        data:{
          notification_id: newAnnouncement.id.toString(),
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
        notification_id: newAnnouncement.id.toString(),
        storageId: storageId ? storageId.toString() : "",
      },
      tokens: validTokens,
    };
    
    await admin.messaging().sendEachForMulticast(message);
    
    return sendData(201, toAnnouncementResponse(newAnnouncement));
  } catch (error) {
    console.error("An error occurred:", error);
    return sendErrors(500, { message: "Internal Server Error" });
  }
});
