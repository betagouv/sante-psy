import express from 'express';

import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import config from './utils/config';
import cspConfig from './utils/csp-config';
import sentry from './utils/sentry';

import errorManager from './middlewares/errorManager';
import getIndex from './controllers/reactController';
import router from './routers';

const { appName } = config;

const app = express();

const BLOCKED_IPS = new Set(['54.165.195.193', '27.34.111.140']);
app.use((req, res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() ?? req.ip;
  if (BLOCKED_IPS.has(ip)) {
    res.status(403).end();
    return;
  }
  next();
});

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = (): void => { };
}

// HSTS is managed directly by scalingo => if we set it there it appears twice and can be misinterpreted
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: false,
}));

app.use((req, res, next) => {
  // Feature-Policy has been replaced by Permissions-Policy but it is still not widely supported
  // see https://caniuse.com/permissions-policy
  res.setHeader('Feature-Policy', "geolocation 'self'");
  res.setHeader(
    'Permissions-Policy',
    // Generated using https://www.permissionspolicy.com/
    // eslint-disable-next-line max-len
    'geolocation=(self), accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()',
  );
  next();
});

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

// prevent abuse
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute window
  max: config.speedLimitation ? 1000 : 10000, // start blocking after X requests for windowMs time
  message: 'Trop de requêtes venant de cette IP, veuillez réessayer plus tard.',
});
app.use(rateLimiter);

app.use(router);

// block undefined /api routes
app.use('/api/*', (req, res) => {
  res.status(404).end();
});

app.get('*', getIndex);

app.use(errorManager);

sentry.initCaptureConsoleWithHandler(app);

const server = app.listen(config.port, () => {
  console.log(`${appName} listening at http://localhost:${config.port}`);
});

export default server;
