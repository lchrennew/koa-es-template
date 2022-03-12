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
            ...handler
        );
    }

    get(path, handlers) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.get(
            path,
            ...handler
        );
    }

    post(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.post(
            path,
            ...handler
        );
    }

    put(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.put(
            path,
            ...handler,
        );
    }

    delete(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.delete(
            path,
            ...handler,
        );
    }

    patch(path, handlers,) {
        const handler = handlers?.map?.(h => h?.bind(this)) ?? [ handlers?.bind(this) ]
        handler && this.router.patch(
            path,
            ...handler,
        );
    }

    upload(path, filehandler, handler,) {
        this.router.post(
            path,
            filehandler,
            handler.bind(this),
        );
    }

    use(path, controller, ...middlewares) {
        this.router.use(path, new controller(this.config, ...this.middlewares, ...middlewares).routes)
    }
}


export default Controller;
