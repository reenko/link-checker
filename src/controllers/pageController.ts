import { NextFunction, Response, Request } from 'express';
import { env } from 'process';

export default class PageController {

    public async renderMainPage(req: Request, res: Response, next: NextFunction) {
        try {
            res.render('main', {
                title: 'Link Checker',
                apiHost: process.env.API_HOST || 'http://localhost:3000',
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
