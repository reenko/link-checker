import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import Routes from './routes';
import ApplicationError from './errors/applicationError';

const handlebars = require('express-handlebars');

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();

    public constructor () {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);

        // Error handler
        this.app.use((error, req, res, next) => {
            if (!error) {
                return next();
            }

            const isAppError = error instanceof ApplicationError;
            let errorMessage = error.message || error;

            if (!isAppError) {
                // TODO: send errors to log system
                errorMessage = 'Internal error';
            }

            res.status(error.httpStatusCode || INTERNAL_SERVER_ERROR).json({
                error: errorMessage
            });
        });

        // 404 page
        this.app.use((_, res) => {
            res.status(NOT_FOUND).json({
                error: 'Not found'
            });
        });
    }

    private config(): void{
        this.app.disable('x-powered-by');
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files
        this.app.use(express.static('public'));

        this.app.engine('hbs', handlebars({
            layoutsDir: __dirname + '/views/layouts',
            extname: 'hbs',
            defaultLayout: 'index',
            partialsDir: __dirname + '/views/partials/'
        }));
        this.app.set('view engine', 'hbs');
        this.app.set('views',  __dirname + '/views/');
    }
}

export default new App().app;
