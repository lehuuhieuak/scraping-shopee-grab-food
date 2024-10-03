import { STATUS_CODE } from '../../constants';

class ErrorResponse extends Error {
    readonly statusCode: STATUS_CODE;

    constructor(message: string, statusCode: STATUS_CODE) {
        super(message);

        this.statusCode = statusCode;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message: string = 'Bad request error') {
        super(message, STATUS_CODE.BAD_REQUEST);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message: string = 'Not found error') {
        super(message, STATUS_CODE.NOT_FOUND);
    }
}

export { BadRequestError, NotFoundError };
