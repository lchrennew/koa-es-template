import EventEmitter from 'eventemitter2';
import getApp from './app.js';
import { createOptions } from './options.js';
import http2 from 'http2'

const createApp = async options => {
    const logger = options.getLogger('server.js');
    const eventBus = new EventEmitter.EventEmitter2();

    const config = {
        eventBus,
        ...options,
    };

    const app = getApp(config);


    return new Promise((resolve, reject) => {
        const payload = {
            app,
            config,
            eventBus,
        };

        if (options.start) {
            const server = http2.createServer(options, app.callback())
                .listen(
                    options.listen,
                    () => logger.info(`${process.env.SERVER_NAME} has started.`, server.address()))
            server.on('listening', () => resolve({ ...payload, server }));
            server.on('error', reject);
        } else {
            resolve({ ...payload });
        }
    });
};

/**
 *
 * @param opts {{index:Controller, preHook, preRouterHook, baseUriPath, listen }}
 * @return {Promise<unknown>}
 */
export const start2 = async opts => createApp(createOptions({ start: true, ...opts }));

/**
 *
 * @param opts {{index:Controller, preHook, preRouterHook, baseUriPath, listen }}
 * @return {Promise<unknown>}
 */
export const create2 = async opts => createApp(createOptions({ start: false, ...opts }));
