import {
  TAnnouncement,
  TStaff,
  TStorage,
} from "@/server/db/schema"
import { StaffResponse, toStaffResponse } from "./staff"
import { StorageResponse, toStorageResponse } from "./storage"

export type AnnouncementResponse = {
  id: number
  title: string
  content: string
  author_id: number
  storage_id: number | null
  storage: StorageResponse | null
  author: StaffResponse | null
  created_at: Date
  updated_at: Date | null
}

export function toAnnouncementResponse(
  announcement?: TAnnouncement,
  relations?: {
    author?: TStaff
    storage?: TStorage
  },
): AnnouncementResponse | null {
  return announcement
    ? {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author_id: announcement.authorId,
        storage_id: announcement.storageId,
        author: toStaffResponse(relations?.author),
        storage: toStorageResponse(relations?.storage),
        created_at: announcement.createdAt,
        updated_at: announcement.updatedAt,
      }
    : null
}
