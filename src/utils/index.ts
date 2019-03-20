import { Session } from '../types/types';
export const getOpenid = (session: Session) => {
    return session.value.split(';')[0];
};
export const getSessionKey = (session: Session) => {
    return session.value.split(';')[1];
};
