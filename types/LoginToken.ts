export type LoginToken = {
    token: string,
    email: string,
    expiresAt: Date
}

export type psyJWT = {
    psychologist: string,
    xsrfToken: string
}
