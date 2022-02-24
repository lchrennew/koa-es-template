
export default config => {
    const logger = config.getLogger('HTTP');
    return async (ctx, next) => {
        const start = process.hrtime();
        await next().catch(error => {
            logger.error(
                ctx.method,
                ctx.path,
                error)
        })
        let time = process.hrtime(start);
        // Format to high resolution time with nano time
        time = time[0] * 1000 + time[1] / 1000000;
        if (!config?.hrtime) {
            // truncate to milliseconds.
            time = Math.round(time);
        }
        ctx.set('X-Response-Time', `${time}ms`);
    };
}
