import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/constants';

export const config = {
    matcher: '/admin/:path*',
};

export function middleware(request: NextRequest) {
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isLoginPath = request.nextUrl.pathname === '/admin/login';

    if (isAdminPath) {
        const adminToken = request.cookies.get(ADMIN_COOKIE_NAME);

        // Strictly check for token existence. 
        // If trying to access ANY admin path (that isn't login) and we don't have a token -> REDIRECT.
        if (!isLoginPath && (!adminToken || !adminToken.value)) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        // If trying to access login page and we DO have a token -> REDIRECT to dashboard.
        if (isLoginPath && adminToken && adminToken.value) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
