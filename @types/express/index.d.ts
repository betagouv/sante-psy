declare namespace Express {
    interface Request {
        user: {
            psychologist: string
        }
        sanitize: (text: string) => string
    }
}
