"use client"

import { ShieldXIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

const causeRedirectMessage: { [key: string]: string } = {
  invalid_session: "Sesi tidak valid, silahkan login kembali",
}

export default function LoginRedirectErrorBox() {
  const cause = useSearchParams().get("cause")

  if (cause) {
    return (
      <div className="flex text-red-500 bg-white rounded-sm p-2">
        <ShieldXIcon className="mr-2" />
        <p>
          {causeRedirectMessage[cause] ??
            "Terjadi kesalahan pada sesi, silahkan login kembali"}
        </p>
      </div>
    )
  } else {
    return null
  }
}
