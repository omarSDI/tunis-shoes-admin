export const ADMIN_COOKIE_NAME = 'luxeshopy_admin';

export function isValidAdminToken(token: string | undefined | null): boolean {
    if (!token) return false;
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        return decoded.includes(':');
    } catch {
        return false;
    }
}
