declare namespace Express {
    interface Request {
        user: {
            psychologist: string,
            xsrfToken: string,
            exp: number
        }
        sanitize: (text: string) => string
    }
}
