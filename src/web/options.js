import merge from 'deepmerge';
import { getLogger, useLogProvider } from "es-get-logger";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const defaultOptions = () => ({
    port: process.env.HTTP_PORT || process.env.PORT || 80,
    host: process.env.HTTP_HOST || '0.0.0.0',
    pipe: undefined,
    baseUriPath: process.env.BASE_URI_PATH || '',
    serverMetrics: true,
    extendedPermissions: false,
    enableRequestLogger: false,
    sessionAge: THIRTY_DAYS,
    adminAuthentication: 'unsecure',
    ui: {},
    importFile: undefined,
    dropBeforeImport: false,
    getLogger,
    disableDBMigration: true,
    start: true,
});

export const createOptions = (opts = {}) => {
    const options = merge(defaultOptions(), opts);

    options.listen = options.pipe
        ? { path: options.pipe }
        : { port: options.port, host: options.host };

    useLogProvider(options.getLogger);

    return options;
}
