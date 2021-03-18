const Sentry = require("@sentry/node");
const sentryIntegrations = require("@sentry/integrations");

const config = require('./config');

/**
 * 
 * @see https://sentry.io/betagouv-f7/sante-psy-prod/getting-started/node-express/
 */
module.exports.initCaptureConsole = function init() {
  const logLevel =  ['error'];
  console.log(`Initializing Sentry for log level "${logLevel}" and config: ${config.sentryDNS}`);
  Sentry.init({
    dsn: config.sentryDNS,
    //https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#captureconsole
    integrations: [
      new sentryIntegrations.CaptureConsole({levels: logLevel}),
    ],
  });
}

module.exports.initCaptureConsoleWithHandler = function initCaptureConsoleWithHandler(app) {
  if( config.sentryDNS ) {
    this.init(config.sentryDNS);

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());

    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
  } else {
    console.log("Sentry was not initialized as SENTRY_DNS env variable is missing");
  }
}