export type StudentLoginToken = {
    token: string,
    email: string,
    expiresAt: Date
}

export type StudentJWT = {
    student: string,
    xsrfToken: string
}
