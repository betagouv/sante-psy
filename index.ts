import express from 'express';
import expressSanitizer from 'express-sanitizer';

import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import compression from 'compression';

import config from './utils/config';
import cspConfig from './utils/csp-config';
import sentry from './utils/sentry';

import errorManager from './middlewares/errorManager';
import getIndex from './controllers/reactController';
import router from './routers';

const { appName } = config;

const app = express();

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

app.use(cspConfig);
app.use(compression());

if (config.useCors) {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
}

app.use(express.json());

app.use(cookieParser(config.secret));

app.use('/*/fonts/', express.static('./dist/frontend/fonts'));
app.use('/static', express.static('static'));
app.get('/', getIndex);
app.use(express.static('./dist/frontend'));

app.use(expressSanitizer());

// prevent abuse
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: config.speedLimitation ? 1000 : 10000, // start blocking after X requests for windowMs time
  message: 'Trop de requêtes venant de cette IP, veuillez réessayer plus tard.',
});
app.use(rateLimiter);

app.use(router);

app.get('*', getIndex);

app.use(errorManager);

sentry.initCaptureConsoleWithHandler(app);

const server = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
});

module.exports = server;
export default server;
