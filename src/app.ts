import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import config from './config/index';
const app = express();
const expressConfig: any = config.express;

Object.keys(expressConfig).forEach((key: string) => {
    app.set(key, expressConfig[key]);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.get('/hello/:id', (req, res) => {
    const result = {
        params: req.params,
        query: req.query,
        route: req.route,
    };
    // res.end(`${JSON.stringify(result)}`);
    // res.jsonp('cb(a)');
    res.sendStatus(401);
});
app.post('/hi', (req, res) => {
    const result = {
        params: req.params,
        query: req.query,
        body: req.body,
    };
    res.end(JSON.stringify(result));
});
app.listen(app.get('port'), (e: any) => {
    if (e) {
        console.log(`[error] ${e.message}`);
        return;
    }
    console.log(`[app start] listen on port:${app.get('port')}`);
});
