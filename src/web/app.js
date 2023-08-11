import cors from '@koa/cors'
import Koa from 'koa'
import body from 'es-koa-body';
import compress from 'koa-compress'
import error from 'es-koa-error';
import requestLogger from './middlewares/request-logger.js';
import responseTime from './middlewares/response-time.js';
import Controller from "./controller.js";
import errorLogger from "./middlewares/error-logger.js";

export default config => {
    const app = new Koa()
    config.preHook?.(app)

    app
        .use(requestLogger(config))
        .use(cors({ credentials: true }))
        .use(compress(config?.compress))
        .use(responseTime(config))
        .use(body(config?.body))
        .use(errorLogger(config))

    config.preRouterHook?.(app)

    const index = config.index ?? Controller
    app.use(new index(config).routes)

    if (process.env.NODE_ENV !== 'production') {
        app.use(error());
    }
    return app

}
