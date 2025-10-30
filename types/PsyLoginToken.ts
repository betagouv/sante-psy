export type PsyLoginToken = {
    token: string,
    email: string,
    expiresAt: Date
}

export type PsyJWT = {
    psychologist: string,
    xsrfToken: string
}
