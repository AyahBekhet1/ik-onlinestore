import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: { request: NextRequest; auth: any }) {
      const { pathname } = request.nextUrl;
      console.log("Middleware - auth:", auth);
      console.log("Middleware - path:", request.nextUrl.pathname);
      const protectedPaths = [
        /^\/profile/,
        /^\/user\/.*/,
        /^\/order\/.*/,
        /^\/admin/,
      ];

      const isProtected = protectedPaths.some((regex) => regex.test(pathname));

      // Block unauthenticated access to protected routes
      if (!auth && isProtected) return false;

      // Use cookie header string — compatible with Edge
      const cookieHeader = request.headers.get("cookie") || "";
      const hasSessionCartId = /sessionCartId=/.test(cookieHeader);

      if (hasSessionCartId) {
        return true; // Let the request through
      }

      // Generate a random ID (UUID-like) manually
      const newSessionCartId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Set cookie using header (not .cookies API — not allowed in Edge)
      const response = NextResponse.next();
      response.cookies.set({
        name: "sessionCartId",
        value: newSessionCartId,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
      

    },
  },
} satisfies NextAuthConfig;
