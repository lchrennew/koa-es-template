import './utils/env.js'
import { create, start } from "./web/server.js";
import { create2, start2 } from "./web/server2.js";
import Controller from "./web/controller.js";
import { defaultLogProvider, getLogger, useLogProvider } from 'es-get-logger'

export {
    create as createServer,
    start as startServer,
    create2 as createServer2,
    start2 as startServer2,
    Controller,
    getLogger,
    defaultLogProvider,
    useLogProvider,
}
