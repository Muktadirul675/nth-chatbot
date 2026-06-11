// proxy.ts (NOT middleware.ts anymore)
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth

// Using the standard Next.js 16 named proxy export format
// export const proxy = auth((req) => {
//   const { pathname } = req.nextUrl;

//   const publicRoutes = ["/api/visit", "/api/chat", "/api/auth"];

//   const isPublic = publicRoutes.some((r) =>
//     pathname.startsWith(r)
//   );

//   if (isPublic) return NextResponse.next();

//   if (!req.auth) {
//     if (pathname.startsWith("/api")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// });