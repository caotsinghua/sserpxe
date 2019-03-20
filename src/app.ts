import express from 'express';
import bodyParser from 'body-parser';
import userController from './controller/user';
import bookController from './controller/book';
import { handleApiResponse, handleError } from './middlewares';
import { createConnection } from 'typeorm';
import 'reflect-metadata';

const app = express();

app.set('port', process.env.PORT || 4000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(handleApiResponse);

app.use('/user', userController);
app.use('/book', bookController);

app.use(handleError);
app.listen(app.get('port'), async (e: any) => {
    if (e) {
        console.log(`[error] ${e.message}`);
        return;
    }
    await createConnection();
    console.log(`[app start] listen on port:${app.get('port')}`);
});
