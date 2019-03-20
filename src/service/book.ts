import * as types from '../types/types';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Book } from '../entity/Book';

const userRepository = getRepository(User);
const bookRepository = getRepository(Book);

// 检查这本书是否被用户喜欢
export const isUserLikeThis = async ({ bookId, openid }: { bookId: string; openid: string }) => {
    const likedBooks = await getUserLikedBooks({ openid });
    if (likedBooks && likedBooks.find((book: any) => book.id == bookId)) {
        return true;
    }
    return false;
};
// 检查这本书是否最近阅读
export const isRecentlyBook = async ({ bookId, openid }: { bookId: string; openid: string }) => {
    const likedBooks = await getUserRecentlyBooks({ openid });
    if (likedBooks && likedBooks.find((book: any) => book.id == bookId)) {
        return true;
    }
    return false;
};

// 获取用户收藏的书籍
export const getUserLikedBooks = async ({ openid }: { openid: string }) => {
    const likedBooks = await userRepository.find({
        select: ['liked_books'],
        where: {
            openid,
        },
    });
    return likedBooks;
};
// 删除收藏的书籍
export const deleteUserLikedBook = async ({
    openid,
    bookId,
}: {
    openid: string;
    bookId: string;
}) => {
    const isLiked = await isUserLikeThis({ openid, bookId });
    const user = await userRepository.findOne({
        where: {
            openid,
        },
    });
    let likedBooks = user.liked_books;
    if (isLiked) {
        likedBooks = likedBooks.filter((book: any) => book.id != bookId);
        user.liked_books = likedBooks;
        await userRepository.save(user);
    }
};

// 获取最近阅读的书籍
export const getUserRecentlyBooks = async ({ openid }: { openid: string }) => {
    const recentlyBooks = await userRepository.find({
        select: ['recently_books'],
        where: {
            openid,
        },
    });
    return recentlyBooks;
};

// 删除最近阅读的书籍
export const deleteUserRecentlyBook = async ({
    openid,
    bookId,
}: {
    openid: string;
    bookId: string;
}) => {
    const isRecently = await isRecentlyBook({ openid, bookId });
    const user = await userRepository.findOne({
        where: {
            openid,
        },
    });
    let recentlyBooks = user.recently_books;
    if (isRecently) {
        recentlyBooks = recentlyBooks.filter((book: any) => book.id != bookId);
        user.recently_books = recentlyBooks;
        await userRepository.save(user);
    }
};

// 添加到收藏
export const addLikeBook = async ({ bookId, openid }: { bookId: string; openid: string }) => {
    const user = await userRepository.findOne({
        where: {
            openid,
        },
    });
    const isLiked = await isUserLikeThis({ bookId, openid });
    if (!isLiked) {
        const book = new Book();
        book.id = bookId;
        await bookRepository.save(book);
        user.liked_books = [...user.liked_books, book];
        await userRepository.save(user);
        return user.liked_books;
    } else {
        throw Error('此书已经收藏');
    }
};

// 添加到最近阅读
export const addRecentlyBook = async ({ bookId, openid }: { bookId: string; openid: string }) => {
    const user = await userRepository.findOne({
        where: {
            openid,
        },
    });
    const isRecently = await isRecentlyBook({ bookId, openid });
    if (!isRecently) {
        const book = new Book();
        book.id = bookId;
        await bookRepository.save(book);
        user.recently_books = [...user.recently_books, book];
        await userRepository.save(user);
        return user.recently_books;
    }
};
