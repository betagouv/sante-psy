import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';
import config from './config';

/**
 * @see https://docs.sentry.io/platforms/node/guides/express/
 */
const initCaptureConsole = (): void => {
  const logLevel = ['error'];
  console.log(`Initializing Sentry for log level "${logLevel}" and config: ${config.sentryDNS}`);
  Sentry.init({
    dsn: config.sentryDNS,
    // https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#captureconsole
    integrations: [
      nodeProfilingIntegration(),
      Sentry.captureConsoleIntegration({ levels: logLevel }),
    ],
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE),
  });
};

const initCaptureConsoleWithHandler = (app: Express): void => {
  if (config.sentryDNS) {
    initCaptureConsole();

    // The error handler must be before any other error middleware and after all controllers
    Sentry.setupExpressErrorHandler(app);
  } else {
    console.log('Sentry was not initialized as SENTRY_DNS env variable is missing');
  }
};

export default {
  initCaptureConsole,
  initCaptureConsoleWithHandler,
};
