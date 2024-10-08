import { errServer } from "@/server/constants/error"

export class ApiError extends Error {
  constructor(public code: number = 500, public errors: any = errServer) {
    super()
  }
}
