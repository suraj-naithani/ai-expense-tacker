import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const sessionCookie = request.cookies.get('better-auth.session_token')?.value;

    const isLoggedIn = !!sessionCookie;

    const isTryingToAccessPrivate = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    if (isTryingToAccessPrivate && !isLoggedIn) {
        const loginUrl = new URL('/signin', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const isTryingToAccessAuthPage = [
        '/signin',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
    ].some(page => pathname.startsWith(page));

    if (isTryingToAccessAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/signin',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        // add any new auth page here once — never touch pages again
    ],
};