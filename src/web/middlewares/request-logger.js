export default config => {
    const logger = config.getLogger('HTTP');
    return async (ctx, next) => {
        await next().catch(error => {
            logger.error(
                ctx.method,
                ctx.href,
                error)
        })
        if (ctx.method !== 'OPTIONS')
            logger.info(
                ctx.status,
                ctx.response.headers['x-response-time'],
                ctx.method,
                ctx.path);
    };
}
