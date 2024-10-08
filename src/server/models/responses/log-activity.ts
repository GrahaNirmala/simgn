import { TLogActivity, TStaff } from "@/server/db/schema";
import { StaffResponse, toStaffResponse } from "./staff";


export type LogActivityResponse = {
    id: number
    authorId: number
    author: StaffResponse | null
    action: string
    target: string
    details: string
    created_at: Date
    updated_at: Date | null
}

export function toLogActivityResponse(
    logActivity?: TLogActivity,
    relations?: {
        author?: TStaff
      },
): LogActivityResponse | null {
    return logActivity
     ? {
        id: logActivity.id,
        authorId: logActivity.authorId,
        author: toStaffResponse(relations?.author),
        action: logActivity.action,
        target: logActivity.target,
        details: logActivity.details,
        created_at: logActivity.createdAt,
        updated_at: logActivity.updatedAt,
      }
    :null
}