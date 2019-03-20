import express from 'express';
import * as types from '../types/types';
import { authenticate } from '../middlewares';
import { getOpenid } from '../utils';
import {
    isUserLikeThis,
    getUserLikedBooks,
    getUserRecentlyBooks,
    deleteUserLikedBook,
    deleteUserRecentlyBook,
    addLikeBook,
    addRecentlyBook,
} from '../service/book';

const bookController = express.Router();

// 查看书籍是否收藏
bookController.get(
    '/likedBooks/:id',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        const openid = getOpenid(req.session);
        const bookId = req.params.id;
        try {
            const isLiked = await isUserLikeThis({ bookId, openid });
            res.apiSuccess({ isLiked });
        } catch (error) {
            next(error);
        }
    },
);
// 最近阅读书籍
bookController.get(
    '/recentlyBooks',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const openid = getOpenid(req.session);
            const recentlyBooks = await getUserRecentlyBooks({ openid });
            res.apiSuccess(recentlyBooks);
        } catch (error) {
            next(error);
        }
    },
);
// 收藏的书籍
bookController.get(
    '/likedBooks',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const openid = getOpenid(req.session);
            const likedBooks = await getUserLikedBooks({ openid });
            res.apiSuccess(likedBooks);
        } catch (error) {
            next(error);
        }
    },
);
// 收藏书籍
bookController.post(
    '/likedBooks/:id',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const bookId = req.params.id;
            const openid = getOpenid(req.session);
            const likedBooks = await addLikeBook({ bookId, openid });
            res.apiSuccess(likedBooks);
        } catch (error) {
            next(error);
        }
    },
);
// 取消收藏
bookController.delete(
    '/likedBooks/:id',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const bookId = req.params.id;
            const openid = getOpenid(req.session);
            await deleteUserLikedBook({ openid, bookId });
            res.apiSuccess({ message: '删除成功' });
        } catch (error) {
            next(error);
        }
    },
);

// 添加或更新到最近阅读书籍
bookController.put(
    '/recentlyBooks/:id',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const bookId = req.params.id;
            const openid = getOpenid(req.session);
            const recentlyBooks = await addRecentlyBook({ bookId, openid });
            res.apiSuccess(recentlyBooks);
        } catch (error) {
            next(error);
        }
    },
);
// 删除最近阅读书籍
bookController.delete(
    '/recentlyBooks/:id',
    authenticate,
    async (req: types.CurRequest, res: types.CurResponse, next: any) => {
        try {
            const bookId = req.params.id;
            const openid = getOpenid(req.session);
            await deleteUserRecentlyBook({ openid, bookId });
            res.apiSuccess({ message: '删除成功' });
        } catch (error) {
            next(error);
        }
    },
);

export default bookController;
