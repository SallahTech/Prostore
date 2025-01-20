// middleware.ts
import {NextResponse} from 'next/server';

export const config = {
    matcher: ['/app/auth/:path*'], // Matches all routes under /app/auth
};

export function middleware(req: any) {
    const sessionCartId = req.cookies.get('sessionCartId');

    if (!sessionCartId) {
        const newSessionCartId = crypto.randomUUID();

        const response = NextResponse.next();
        response.cookies.set('sessionCartId', newSessionCartId);
        return response;
    }

    return NextResponse.next();
}
