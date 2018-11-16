import path from 'path';
export default {
    express: {
        port: 3002,
        views: path.resolve(__dirname, '../views'),
        'view engine': 'pug',
        static: path.resolve(__dirname, '../../static'),
    },
};
