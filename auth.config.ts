import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: { request: NextRequest; auth: any }) {
      const protectedPaths = [
        /^\/profile/,
        /^\/user\/.*/,
        /^\/order\/.*/,
        /^\/admin/,
      ];

      const { pathname } = request.nextUrl;

      const isProtected = protectedPaths.some((regex) => regex.test(pathname));

      // If unauthenticated and path is protected, deny access
      if (!auth && isProtected) return false;

      // Ensure sessionCartId exists, or set a new one
      const cookieHeader = request.headers.get("cookie") || "";
      const hasSessionCartId = cookieHeader.includes("sessionCartId=");
      // If cookie exists, allow request
      if (hasSessionCartId) return true;

      // Generate UUID manually for Edge Runtime
      const newSessionCartId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Create a response that sets the cookie
      const response = NextResponse.next();
      response.headers.append(
        "Set-Cookie",
        `sessionCartId=${newSessionCartId}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly`
      );

      return response;
    },
  },
} satisfies NextAuthConfig;
