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

    constructor(config) {
        this.router = new Router().prefix(config.baseUriPath)
        this.config = config;
        this.logger = config.getLogger(this.constructor.name)
    }

    get routes() {
        return this.router.routes()
    }

    get emitAsync() {
        return this.config.eventBus.emitAsync
    }

    get addListener() {
        return this.config.eventBus.addListener
    }

    get on() {
        return this.config.eventBus.on
    }

    get once() {
        return this.config.eventBus.once
    }

    get many() {
        return this.config.eventBus.many
    }

    get prependMany() {
        return this.config.eventBus.prependMany
    }

    get prependOnceListener() {
        return this.config.eventBus.prependOnceListener
    }

    get prependListener() {
        return this.config.eventBus.prependListener
    }

    get prependAny() {
        return this.config.eventBus.prependAny
    }

    get onAny() {
        return this.config.eventBus.onAny
    }

    get offAny() {
        return this.config.eventBus.offAny
    }

    get removeListener() {
        return this.config.eventBus.removeListener
    }

    get off() {
        return this.config.eventBus.off
    }

    get removeAllListeners() {
        return this.config.eventBus.removeAllListeners
    }

    get setMaxListeners() {
        return this.config.eventBus.setMaxListeners
    }

    get getMaxListeners() {
        return this.config.eventBus.getMaxListeners
    }

    get eventNames() {
        return this.config.eventBus.eventNames
    }

    get listeners() {
        return this.config.eventBus.listeners
    }

    get listenersAny() {
        return this.config.eventBus.listenersAny
    }

    get hasListeners() {
        return this.config.eventBus.hasListeners
    }

    get waitFor() {
        return this.config.eventBus.waitFor
    }

    get listenTo() {
        return this.config.eventBus.listenTo
    }

    get stopListeningTo() {
        return this.config.eventBus.stopListeningTo
    }

    all(path, handlers){
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

    use(path, controller) {
        this.router.use(path, controller.routes)
    }
}


export default Controller;
