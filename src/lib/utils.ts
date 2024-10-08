import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from "zod"
import { toast } from "sonner"
import { Role, RoleType } from "@/server/security/auth"
import { errServer } from "@/server/constants/error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberFormat(value: number) {
  const formatter = new Intl.NumberFormat("id")

  const formattedValue = `Rp ${formatter.format(value)}`

  return formattedValue
}

function join(t: Date, a: any, s: string) {
  function format(m: any) {
    let f = new Intl.DateTimeFormat("id", m)
    return f.format(t)
  }
  return a.map(format).join(s)
}

export function dateFormat(
  dateObj: Date,
  isTimeDetail: boolean = false,
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: isTimeDetail ? 'long' : 'short',
    year: 'numeric',
    hour12: false,
  };

  const dateFormatter = new Intl.DateTimeFormat('id-ID', options);
  const datePart = dateFormatter.format(dateObj);

  if (isTimeDetail) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const timeFormatter = new Intl.DateTimeFormat('id-ID', timeOptions);
    const timePart = timeFormatter.format(dateObj);

    return `${datePart} - ${timePart}`;
  }
  return datePart;
}


export function parseJwt(token: string): {
  sub: string
  role: Role
  role_type: RoleType
  iat: number
  exp: number
} {
  try {
    var base64Url = token.split(".")[1]
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    throw new Error("Token tidak valid")
  }
}

export function normalizePhone(phone: string): string {
  phone = String(phone).trim()
  if (phone.startsWith("+62")) {
    phone = "0" + phone.slice(3)
  } else if (phone.startsWith("62")) {
    phone = "0" + phone.slice(2)
  }
  return phone.replace(/[- .]/g, "")
}

export function capitalizeSentence(sentence: string) {
  const arr = sentence.split(" ")

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  return arr.join(" ")
}

export function handleError() {}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return toast.error(errors.join("\n"))
  } else if (err instanceof Error) {
    return toast.error(err.message)
  } else {
    return toast.error(errServer)
  }
}
