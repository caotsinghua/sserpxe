import { Request, Response } from 'express';
export interface CurRequest extends Request {
    session: Session;
}
export interface CurResponse extends Response {
    apiSuccess?: Function;
    apiError?: Function;
}

export interface Session {
    key: string;
    value: string;
    expires_at: number;
}

export interface successResponse {
    success: boolean;
    result: any;
}
export interface failedResponse {
    success: boolean;
    code: string;
    message: string;
}
