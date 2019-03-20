import express from 'express';
import { codeToSession, createUser, updateUserNickname } from '../service/wechat_login';
import * as types from '../types/types';
import { getOpenid } from '../utils';
import { authenticate } from '../middlewares/';
const userController = express.Router();

userController.post('/login', async (req: types.CurRequest, res: types.CurResponse, next: any) => {
    try {
        const { code } = req.body;
        const session = await codeToSession(code);
        req.session = session;
        const openid = getOpenid(session);
        //未注册就创建一个用户
        const user = await createUser({ openid, nickname: '' });
        res.apiSuccess({
            key: session.key,
            user,
        });
    } catch (error) {
        next(error);
    }
});
/**
 *
 * @api {put} /nickname 修改昵称
 * @apiName 修改昵称
 * @apiGroup user
 * @apiVersion  1.0.0
 *
 *
 * @apiParam  {String} nickname 新昵称
 *
 * @apiSuccess (200) {json} result description
 *
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 *
 */
userController.put(
    '/nickname',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const { nickname } = req.body;
            const { session } = req;
            const openid = getOpenid(session);
            const user = await updateUserNickname({ openid, nickname });
            res.apiSuccess(user);
        } catch (error) {
            next(error);
        }
    },
);
export default userController;
