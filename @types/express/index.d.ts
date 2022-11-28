declare namespace Express {
    interface Request {
        auth: {
            psychologist: string,
            xsrfToken: string,
            exp: number
        }
        sanitize: (text: string) => string
    }
}
