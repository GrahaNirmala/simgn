import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseJwt } from "./lib/utils";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (token) {
      try {
        const { role_type, role } = parseJwt(token);

        if (role_type === "occupant") {
          return NextResponse.redirect(new URL("/app/dashboard", req.url));
        } else if (role_type === "staff") {
          if (role === "secretary") {
            if (
              !req.nextUrl.pathname.includes("/house") &&
              !req.nextUrl.pathname.includes("/announcement") &&
              !req.nextUrl.pathname.includes("/account")
            ) {
              return NextResponse.redirect(new URL("/admin/account", req.url));
            }
          } else if (role === "treasurer") {
            if (
              !req.nextUrl.pathname.includes("/bill") &&
              !req.nextUrl.pathname.includes("/transaction") &&
              !req.nextUrl.pathname.includes("/report")
            ) {
              return NextResponse.redirect(new URL("/admin/bill", req.url));
            }
          } else {
            return NextResponse.redirect(new URL("/admin", req.url));
          }
        }
      } catch (error) {
        const response = NextResponse.redirect(
          new URL("/login?error=invalid_token", req.url)
        );
        response.cookies.delete("token");
        return response;
      }
    }

    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/app")) {
    const houseId = req.cookies.get("houseId")?.value;
    const response = NextResponse.redirect(new URL("/login", req.url));

    if (token && houseId) {
      try {
        const { role_type } = parseJwt(token);
        if (role_type === "occupant") return NextResponse.next();
        else if (role_type === "staff")
          return NextResponse.redirect(new URL("/admin", req.url));
      } catch (error) {
        const response = NextResponse.redirect(
          new URL("/login?cause=invalid_session", req.url)
        );
        response.cookies.delete("token");
        return response;
      }
    } else {
      req.cookies.getAll().forEach((cookie) => {
        response.cookies.delete(cookie.name);
      });
    }

    return response;
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (token) {
      try {
        const { role, role_type } = parseJwt(token);
        if (role_type === "staff") {
          if (role === "secretary") {
            if (
              !req.nextUrl.pathname.includes("/house") &&
              !req.nextUrl.pathname.includes("/announcement") &&
              !req.nextUrl.pathname.includes("/account")
            ) {
              return NextResponse.redirect(new URL("/admin/account", req.url));
            }
          } else if (role === "treasurer") {
            if (
              !req.nextUrl.pathname.includes("/bill") &&
              !req.nextUrl.pathname.includes("/transaction")&&
              !req.nextUrl.pathname.includes("/report")
            ) {
              return NextResponse.redirect(new URL("/admin/bill", req.url));
            }
          }
          return NextResponse.next();
        } else if (role_type === "occupant") {
          return NextResponse.redirect(new URL("/app/dashboard", req.url));
        }
      } catch (error) {
        const response = NextResponse.redirect(new URL("/admin/login", req.url));
        response.cookies.delete("token");
        return response;
      }
    }

    return NextResponse.redirect(
      new URL("/admin/login?cause=invalid_session", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
