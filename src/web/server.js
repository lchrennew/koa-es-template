import EventEmitter from 'eventemitter2';
import getApp from './app.js';
import { createOptions } from './options.js';

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
            const server = app.listen(options.listen, () =>
                logger.info(`${process.env.SERVER_NAME} has started.`, server.address()),
            );
            server.on('listening', () => resolve({ ...payload, server }));
            server.on('error', reject);
        } else {
            resolve({ ...payload });
        }
    });
};

export const start = async opts => createApp(createOptions({ start: true, ...opts }));

export const create = async opts => createApp(createOptions({ start: false, ...opts }));
