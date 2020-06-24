import { createServer } from 'http';

import app from './app';

const PORT = process.env.PORT || 3000;

(async () => {
    createServer(app).listen(PORT, () =>
        console.info(`Server running on port ${PORT}`)
    );
})();
