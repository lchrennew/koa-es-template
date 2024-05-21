import client from 'prom-client'

const { collectDefaultMetrics, register } = client

export default config => {
    collectDefaultMetrics(config.metrics)
    return async ctx => {
        ctx.type = register.contentType
        ctx.body = await register.metrics()
    };
}
