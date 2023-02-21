import Router from '@koa/router'


/**
 * Base class for Controllers to standardize binding to express Router.
 */
class Controller {
    logger
    /**
     * @type {Router}
     */
    router;
    eventBus;

    middlewares

    constructor(config, ...middlewares) {
        this.middlewares = middlewares;
        this.router = new Router().prefix(config.baseUriPath)
        this.config = config;
        this.eventBus = config.eventBus
        this.logger = config.getLogger(this.constructor.name)
    }

    get routes() {
        return this.router.routes()
    }

    all(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.all(
            path,
            ...this.middlewares,
            ...handler
        );
    }

    get(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.get(
            path,
            ...this.middlewares,
            ...handler
        );
    }

    post(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.post(
            path,
            ...this.middlewares,
            ...handler
        );
    }

    put(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.put(
            path,
            ...this.middlewares,
            ...handler,
        );
    }

    delete(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.delete(
            path,
            ...this.middlewares,
            ...handler,
        );
    }

    patch(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.patch(
            path,
            ...this.middlewares,
            ...handler,
        );
    }

    upload(path, filehandler, handler,) {
        this.router.post(
            path,
            ...this.middlewares,
            filehandler,
            handler.bind(this),
        );
    }

    use(path, controller, ...middlewares) {
        this.router.use(path, new controller(this.config, ...this.middlewares, ...middlewares).routes)
    }
}


export default Controller;
