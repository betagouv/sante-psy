export type LoginToken = {
    token: string,
    email: string,
    expiresAt: Date
}

export type JWT = {
    psychologist: string,
    xsrfToken: string
}
