import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import isUrl from 'validator/lib/isUrl';
import ApplicationError from '../errors/applicationError';

export default class UrlService {

    public static async getHeadersInfo (link: string) {
        if (!link || !isUrl(link)) {
            throw new ApplicationError('Wrong url');
        }

        let parsedURL = url.parse(link);
        if (!parsedURL.protocol) {
            // TODO: set http by defauld and catch 301 redirect

            parsedURL = url.parse('https://' + link);
        }

        const protocolHandler = (parsedURL.protocol === 'http:' ? http : https);

        return new Promise((resolve) => {
            let req = protocolHandler.request({
                protocol: parsedURL.protocol, 
                hostname: parsedURL.hostname,
                method: 'HEAD',
                path: parsedURL.path
            }, (res) => resolve(res.headers))
            req.on('error', () => resolve(null));
            req.end();
        })
    }

}
