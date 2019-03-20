import * as types from '../types/types';
export const handleApiResponse = (req: types.CurRequest, res: types.CurResponse, next: any) => {
    res.apiSuccess = function(data: any) {
        const resJson: types.successResponse = {
            success: true,
            result: data,
        };
        res.json(resJson);
    };
    res.apiError = function(error: any) {
        const resJson: types.failedResponse = {
            success: false,
            code: error.code || 'UNKNOW',
            message: error.message || error.toString(),
        };
        res.status(error.code || 500).json(resJson);
    };
    next();
};
export const handleError = (
    error: any,
    req: types.CurRequest,
    res: types.CurResponse,
    next: any,
) => {
    res.apiError(error);
    next();
};

export const authenticate = (req: types.CurRequest, res: types.CurResponse, next: any) => {
    const sessionKey = req.get('session-key');
    const { session } = req;
    if (!session)
        return res.apiError({
            code: 403,
            message: '没有登录',
        }); //没有session'
    if (session.key !== sessionKey)
        return res.apiError({
            code: 403,
            message: 'sessionKey不一致',
        }); //sessionkey不一致
    if (Date.now() > session.expires_at)
        return res.apiError({
            code: 403,
            message: '登陆状态已过期',
        }); //sessionkey已经过期
    next();
};
