const packageJSON = require('../../package.json');

export default {
    appName: packageJSON.name,
    appVersion: packageJSON.version,
    sentry: {
        version: packageJSON.version,
        dsn: packageJSON.sentry.dsn
    }
};