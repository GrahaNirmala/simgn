import { errServer } from "@/server/constants/error"
import { NextResponse } from "next/server"

export function sendData(code: number, data: any, meta?: any) {
  return NextResponse.json(
    {
      status: true,
      meta: meta ?? null,
      data: data,
    },
    {
      status: code,
    },
  )
}

export function sendErrors(
  code: number,
  errors:
    | { field?: string; message: string }[]
    | { field?: string; message: string },
  meta?: any,
) {
  return NextResponse.json(
    {
      status: false,
      meta: meta ?? null,
      errors: Array.isArray(errors) ? errors : [errors],
    },
    {
      status: code,
    },
  )
}

export function sendErrorServer() {
  return sendErrors(500, { message: errServer })
}

export function sendNoContent() {
  return new NextResponse(null, { status: 204 })
}
