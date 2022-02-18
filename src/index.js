import './utils/env.js'
import { create, start } from "./web/server.js";
import Controller from "./web/controller.js";
import { getLogger, defaultLogProvider, useLogProvider } from 'es-get-logger'

export {
    create as createServer,
    start as startServer,
    Controller,
    getLogger,
    defaultLogProvider,
    useLogProvider,
}
