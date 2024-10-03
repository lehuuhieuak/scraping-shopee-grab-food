import { Response } from 'express';

import { STATUS_CODE } from '../../constants';

class BaseResponse {
    readonly message?: string;
    readonly data: {} | null;
    readonly statusCode: STATUS_CODE;

    constructor({
        message = 'Send request successfully',
        data = null,
        statusCode = STATUS_CODE.OK
    }: {
        message?: string;
        data?: {} | null;
        statusCode?: STATUS_CODE;
    }) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    send(res: Response) {
        return res.status(this.statusCode).json(this);
    }
}

export { BaseResponse };
