import {ResponseError} from '../models/response.error';

export class HttpError extends Error {
    code: string;
    error: ResponseError;
}
