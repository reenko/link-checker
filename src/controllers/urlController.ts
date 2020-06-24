import { NextFunction, Response, Request } from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import UrlService from '../services/urlService';

export default class UrlController {

    public async getHeadersInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const link = req.query.link as string;
            const headers = await UrlService.getHeadersInfo(link);

            res.status(HttpStatusCodes.OK).json({
                message: 'OK',
                headers // TODO: add transformer
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
