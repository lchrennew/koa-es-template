import Controller from '../Controller.js';
import apiDef from './apiDef.js';

export default class AdminApi extends Controller {
    constructor(config) {
        super(config);
        this.get('/', this.def)
    }

    def(ctx) {
        ctx.body = apiDef
    }
}
