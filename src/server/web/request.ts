import { ZodError, z } from "zod"
import { ApiError } from "../models/exceptions/api"

export async function bindJson<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<z.infer<T>> {
  try {
    const body = await req.json()
    return await schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, error.errors)
    }
    throw new ApiError(400, "Please input valid json")
  }
}
