export type LoginToken = {
    token: string,
    email: string,
    expiresAt: Date,
    role: 'psy' | 'student'
    signInAttempts: number,
}

export type psyJWT = {
    psychologist?: string, // old JWT format
    userId?: string,
    xsrfToken: string,
    role?: 'psy' | 'student'
}
