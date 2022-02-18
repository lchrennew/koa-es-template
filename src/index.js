import './utils/env.js'
import { create, start } from "./web/server.js";
import controller from "./web/controller.js";
import { defaultLogProvider } from './utils/logger.js'

export const createServer = create
export const startServer = start
export const Controller = controller
export const getLogger = defaultLogProvider
