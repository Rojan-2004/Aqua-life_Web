import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/frontend/login", "/frontend/register"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth_token")?.value;
    const userDataStr = request.cookies.get("user_data")?.value;

    let user = null;
    if (userDataStr) {
        try {
            user = JSON.parse(decodeURIComponent(userDataStr));
        } catch (e) {
            try {
                user = JSON.parse(userDataStr);
            } catch (err) {
                // ignore
            }
        }
    }

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // 1. Unauthenticated users trying to access protected routes -> redirect to login
    if (!token && (isDashboardRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL("/frontend/login", request.url));
    }

    // 2. Authenticated non-admin trying to access admin routes -> redirect to unauthorized
    if (token && isAdminRoute) {
        if (!user || user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    // 3. Authenticated users trying to access public routes -> redirect to dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/frontend/login",
        "/frontend/register",
        "/dashboard/:path*",
        "/admin/:path*",
    ]
};
