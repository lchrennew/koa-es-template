import AdminApi from './AdminApi/index.js';
import apiDef from './apiDef.js';
import ClientApi from './ClientApi/index.js'
import Controller from './Controller.js';


export default class IndexController extends Controller {
    constructor(config) {
        super(config);
        this.get('/', this.def)

        this.use('/client-api', new ClientApi(config))
        this.use('/admin-api', new AdminApi(config))
    }

    async def(ctx) {
        ctx.body = apiDef
    }
}
