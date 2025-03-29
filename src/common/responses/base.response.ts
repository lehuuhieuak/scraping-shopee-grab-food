import { Response } from 'express';

import { STATUS_CODE } from '../../constants';

class BaseResponse {
    readonly message?: string;
    readonly data: {} | null;
    readonly statusCode: STATUS_CODE;
    readonly total: number;

    constructor({
        message = 'Send request successfully',
        data = null,
        statusCode = STATUS_CODE.OK,
        total = 0
    }: {
        message?: string;
        data?: {} | null;
        statusCode?: STATUS_CODE;
        total?: number;
    }) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.total = total;
    }

    send(res: Response) {
        return res.status(this.statusCode).json(this);
    }
}

export { BaseResponse };
