declare namespace Express {
    interface Request {
        user: {
            psychologist: string,
            xsrfToken: string
        }
        sanitize: (text: string) => string
    }
}
