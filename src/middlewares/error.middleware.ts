import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { BaseResponse } from '../common/responses/base.response';
import { STATUS_CODE } from '../constants';

const errorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error?.statusCode ?? STATUS_CODE.SERVER_ERROR;
    const errorMessage = error.message ?? 'Something went wrong, try again later';

    return new BaseResponse({ message: errorMessage, statusCode }).send(res);
};

export { errorHandler };
