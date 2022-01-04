export class ErrorResponse {
    statusCode: number
    errorMessage: string

    constructor(statusCode: number, errorMessage: string) {
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
    }
}
