declare namespace Express {
    interface Request {
        auth: {
            psychologist?: string, // old JWT format
            userId?: string,
            xsrfToken: string,
            exp: number,
            role?: 'psy' | 'student'
        }
        sanitize: (text: string) => string
    }
}
