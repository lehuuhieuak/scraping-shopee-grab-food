import { BaseResponse } from './base.response';
import { STATUS_CODE } from '../../constants';

class Ok extends BaseResponse {
    constructor({ message, data }: { message?: string; data: {} | null }) {
        super({ message, data });
    }
}

class Created extends BaseResponse {
    constructor({ message = 'Created successfully', data }: { message?: string; data: {} | null }) {
        super({ message, data, statusCode: STATUS_CODE.CREATED });
    }
}

export { Created, Ok };
