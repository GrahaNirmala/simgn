import { GET } from "./+get"

// If route only contains GET method, it will be static, but we use req.headers on getToken and it will be warning on build
export const dynamic = "force-dynamic"

export { GET }
