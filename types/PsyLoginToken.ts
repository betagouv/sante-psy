export type PsyLoginToken = {
    token: string,
    email: string,
    expiresAt: Date
}

export type UserJWT = {
    user: string,
    xsrfToken: string
}
