import request from 'request-promise';
import crypto from 'crypto';
import { appid, appSecret } from '../config/index';
import * as types from '../types/types';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const codeToSession = async (code: string) => {
    try {
        const res = await request({
            uri: 'https://api.weixin.qq.com/sns/jscode2session',
            qs: {
                appid,
                secret: appSecret,
                js_code: code,
                grant_type: 'authorization_code',
            },
            json: true,
        });
        const {
            openid,
            session_key,
            expires_in,
        }: { openid: string; session_key: string; expires_in: number } = res;
        const session: types.Session = {
            key: getRandomKey(),
            value: `${openid};${session_key}`,
            expires_at: Date.now() + expires_in,
        };
        return session;
    } catch (error) {
        throw error;
    }
};

function getRandomKey() {
    const source = `${Date.now()}${Math.random() * 1000}`;
    const key = crypto.createHmac('sha256', source).digest('hex');
    return key;
}

export const createUser = async ({ openid, nickname }: { openid: string; nickname: string }) => {
    const userRepository = getRepository(User);
    let existUser = await userRepository.findOne({
        where: {
            openid,
        },
    });
    if (!existUser) {
        // 用户未注册
        const newUser = new User();
        Object.assign(newUser, {
            openid,
            nickname,
        });
        existUser = await userRepository.save(newUser);
    }
    return existUser;
};

export const updateUserNickname = async ({
    openid,
    nickname,
}: {
    openid: string;
    nickname: string;
}) => {
    const userRepository = getRepository(User);
    let user = await userRepository.findOne({
        where: {
            openid,
        },
    });
    if (user) {
        user.nickname = nickname;
        user = await userRepository.save(user);
    }
    return user;
};
