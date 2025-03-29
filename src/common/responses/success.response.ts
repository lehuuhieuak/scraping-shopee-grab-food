import { BaseResponse } from './base.response';
import { STATUS_CODE } from '../../constants';

class Ok extends BaseResponse {
    constructor({ message, data, total }: { message?: string; data: {} | null, total: number }) {
        super({ message, data,total });
    }
}

class Created extends BaseResponse {
    constructor({ message = 'Created successfully', data }: { message?: string; data: {} | null }) {
        super({ message, data, statusCode: STATUS_CODE.CREATED });
    }
}

export { Created, Ok };
