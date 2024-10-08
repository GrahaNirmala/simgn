import { defineHandler } from "@/server/web/handler"
import { sendNoContent } from "@/server/web/response"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export const GET = defineHandler(async (req) => {
  const res = sendNoContent()
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name)
    })

  return res
})
