import { db } from "@/server/db";
import { LogActivity, TInsertLogActivity } from "@/server/db/schema";

export async function logActivity(
  authorId: number,
  action: string,
  target: string,
  details: string
) {
  const log: TInsertLogActivity = {
    authorId,
    action,
    target,
    details,
    createdAt: new Date(),
    updatedAt: null,
  };

  await db().insert(LogActivity).values(log);
}