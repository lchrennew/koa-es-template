export default config => {
    const logger = config.getLogger('ERROR');
    return async (ctx, next) =>
        await next().catch(error => {
            logger.info(ctx.method, ctx.path)
            logger.error(error)
        });
}
