import { getApi } from "es-fetch-api";
import { POST } from "es-fetch-api/middlewares/methods.js";
import { json } from "es-fetch-api/middlewares/body.js";

const interval = 1000 * 60
const server = process.env.SERVER_NAME
const host = process.env.HOSTNAME

export const tpsCollector = config => {
    const logger = config.getLogger('TPS_COLLECTOR');
    const timeBox = { tps: 0 }
    setInterval(() => {
        const { tps } = timeBox
        timeBox.tps = 0
        const api = getApi()
        const data = { server, host, tps }
        logger.info('Collecting TPS Data: ', data)
        api(process.env.TPS_COLLECTOR, POST, json(data))
            .catch(e => logger.error(e))
    }, interval)


    return async (ctx, next) => {
        timeBox.tps++
        await next()
    }
}