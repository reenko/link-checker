
import UrlController from '../controllers/urlController';
import PageController from '../controllers/pageController';

const urlController: UrlController = new UrlController();
const pageController: PageController = new PageController();

export default class Routes {

    public routes(app): void {
        app.route('/')
            .get(pageController.renderMainPage);

        app.route('/url/headers')
            .get(urlController.getHeadersInfo);
    }
}
