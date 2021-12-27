# koa-es-template

node.js es koa服务基础模版

**本模板需要node.js 17.2.0**

## 依赖安装：

### yarn

```shell
yarn
```

### npm

```shell
npm i
```

## 开发指南

### Controller基础教程

#### 第1步：写一个新的Controller文件，比如`my-controller.js`

```ecmascript 6
import Controller from "./Controller.js";

export default class MyControlller extends Controller {
    constructor(config) {
        super(config);
    }
}
```

#### 第2步：将新的Controller文件注册到上一级Controller里

以`src/web/routes/index.js`为例：

```ecmascript 6
import MyController from './my-controller.js'

export default class IndexController extends Controller {
    constructor(config) {
        super(config);
        this.use('/my', new MyController(config)) // IndexController的基地址是/，所以MyController中所有接口的基地址都是 /my/
    }
}
```

#### 第3步：在新的Controller里添加请求响应逻辑

```ecmascript 6
import Controller from "./Controller.js";

export default class MyControlller extends Controller {
    constructor(config) {
        super(config);
        this.get('/users', this.getUsers)
        this.post('/users', this.addUser)
        this.delete('/users/:id', this.deleteUser)
        this.put('/users/:id', this.replaceUser)
        this.patch('/users/:id', this.updateUser)
    }

    // 对应的请求：GET /admin-api/my/users
    async getUsers(ctx) {
        ctx.body = []
    }

    // 对应的请求：POST /my/users
    async addUser(ctx) {
        const data = ctx.request.body
        // 处理数据
        return data
    }

    // 对应的请求，例如要删除ID=1的用户：DELETE /my/users/1
    async deleteUser(ctx) {
        const { id } = ctx.params
        // 处理数据
        ctx.body = { ok: true }
    }

    // 对应的请求，例如要替换ID=1的用户：PUT /my/users/1
    async replaceUser(ctx) {
        const data = ctx.request.body
        // 处理数据
        ctx.body = { ok: true }
    }

    // 对应的请求，例如要更新ID=1的用户：PATCH /my/users/1
    async updateUser(ctx) {
        const data = ctx.request.body
        // 处理数据
        ctx.body = { ok: true }
    }
}
```

### Controller高级教程

#### 高级用法1：使用洋葱式的响应逻辑

```ecmascript 6
export default class MyControlller extends Controller {
    constructor(config) {
        super(config);
        // 下面这个DELETE请求处理会按从左到右的顺序逐层调用，并按照从右到左的顺序逐层返回
        // 各层之间可以使用ctx.state传递数据
        this.delete('/users/:id', [ this.requireAuth, this.userExists, this.deleteUser ])
    }

    // 第二个参数next是个异步函数，用来调用下一层
    async requireAuth(ctx, next) {
        const token = ctx.get('token')
        const user = await getUserByToken(token)
        if (!user) ctx.throw(401, JSON.stringify({ ok: false, error: '没有登录' }))
        ctx.state.currentUser = user // 把当前用户存储到这里，以便在后续任何层都可以直接获取
        await next() // 调用next会调用下一层的this.userExists

        // this.userExists执行完后才会运行到这里（注意：如果this.userExists中调用了ctx.throw就不会运行到这里）
        console.log('requireAuth完成了next的调用')
    }

    // 第二个参数next是个异步函数，用来调用下一层
    async userExists(ctx, next) {
        const { id } = ctx.params
        const user = await getUserById(id)
        if (!user) ctx.throw(404, JSON.stringify({ ok: false, error: '要删除的用户不存在' }))
        ctx.state.userToBeDeleted = user // 把要删除的用户存储到这里，以便在后续任何层都可以直接获取
        await next() // 调用next会调用下一层的this.deleteUser

        // this.deleteUser执行完后才会运行到这里（注意：如果this.deleteUser中调用了ctx.throw就不会运行到这里）
        console.log('userExists完成了next的调用')
    }

    async deleteUser(ctx) {
        const { currentUser, userToBeDeleted } = ctx.state // 这样就可以取出前面几层传入的数据了
        await deleteUser(userToBeDeleted, currentUser)
        ctx.body = { ok: true }
    }
}
```

#### 高阶用法2：跨Controller复用处理层

可以将需要复用的层提取为单独的处理函数，存到单独的文件中，并通过import的方式进行复用。 以上例中的requireAuth为例，可以单独将requireAuth提取到require-auth.js文件中：

```ecmascript 6
// require-auth.js文件的内容
export default async (ctx, next) => {
    const token = ctx.get('token')
    const user = await getUserByToken(token)
    if (!user) ctx.throw(401, JSON.stringify({ ok: false, error: '没有登录' }))
    ctx.state.currentUser = user // 把当前用户存储到这里，以便在后续任何层都可以直接获取
    await next() // 调用next会调用下一层的this.userExists

    // this.userExists执行完后才会运行到这里（注意：如果this.userExists中调用了ctx.throw就不会运行到这里）
    console.log('requireAuth完成了next的调用')
}
```

然后，在MyController中加以复用：

```ecmascript 6
import requireAuth from './require-auth.js'

export default class MyControlller extends Controller {
    constructor(config) {
        super(config);
        // requireAuth 是从require-auth.js引入的，它也可以被引入到其他的Controller中进行复用
        this.delete('/users/:id', [ requireAuth, this.userExists, this.deleteUser ])
    }

    async userExists(ctx, next) {
        // ...
    }

    async deleteUser(ctx) {
        // ...
    }
}
```

### 打日志教程

#### 在Controller内部

可以直接使用this.logger

```ecmascript 6
this.logger.info('hello')
```

#### 在其他js文件中

需要先获取制定名称的logger，然后再使用：

```ecmascript 6
const logger = defaultLogProvider('require-auth.js')
logger.debug('hello')
```

### 调用第三方接口指南

#### 基础用法

##### 步骤1：初始化远程接口调用对象

```ecmascript 6
import { getApi } from "./fetch.js";

const api = getApi(process.env.SOME_API_BASE_URL) // 比如：SOME_API_BASE_URL=http://example.com/api
```

##### 步骤2：编写简单的GET调用

```ecmascript 6
import apiDef from "./apiDef.js";
import { getApi, json, POST } from "./fetch.js";

const api = getApi(process.env.SOME_API_BASE_URL) // 比如：SOME_API_BASE_URL=http://example.com/api

const getUserById = async id => {
    const resposne = await api('users') // 默认使用GET，请求地址为：http://example.com/api/users
    const data = await response.json() // 如果接口返回json，可以直接这样获取json对象
    return data
}
```

##### 步骤3：编写简单的POST调用并发送json内容

```ecmascript 6
import apiDef from "./apiDef.js";
import { getApi, json, POST } from "./fetch.js";

const api = getApi(process.env.SOME_API_BASE_URL) // 比如：SOME_API_BASE_URL=http://example.com/api

const updateUser = async user => {
    // 下面的请求使用POST，请求发送的内容是user对象的json序列化串
    const response = await api(`users/${user.id}`, POST, json(user)) // 还支持PUT、PATCH、DELETE
    // ...
}
```

#### 进阶用法

##### 高阶用法1：扩展请求逻辑并用于特定的请求
比如发送自定义请求头（如Authorization），遵循下面两个步骤即可

**首先，要编写一个请求处理逻辑**

```ecmascript 6
// 这个逻辑一定要包含两个参数
// 第一个参数是当前请求的上下文信息
// 第二个参数是固定的
const auth = async (ctx, next) => {
    ctx.header('Authorization', `token ${getToken()}`);
    return next() // 函数一定要返回next()，注意，不要忘记return关键字
}
```

**然后，直接将这个处理逻辑添加到需要它的请求调用参数中即可，例如：**
```ecmascript 6
const updateUser = async user => {
    // 下面的请求将会自动添加Authorization头
    // 直接将auth添加到参数列表中，除url位置必须固定在第一个外，其他参数没有固定顺序
    const response = await api(`users/${user.id}`, auth, PATCH, json(user)) 
}
```

##### 高阶用法2：将扩展逻辑用于所有请求
通过改造api对象的逻辑实现，例如：

```ecmascript 6
import apiDef from "./apiDef.js";
import { getApi, json, PATCH } from "./fetch.js";

const apiCore = getApi(process.env.SOME_API_BASE_URL)
// 将auth逻辑直接插入到api的声明中，这样api发出的所有请求，都会经过auth的处理
const api = async (path, ...args) => await apiCore(path, auth, ...args)

const updateUser = async user => {
    // 下面的请求将会自动添加Authorization头
    const response = await api(`users/${user.id}`, PATCH, json(user))
    // ...
}
```

##### 高阶用法3：统一处理响应
依然通过改造api对象来实现，例如，下面的代码实现了api数据的提取和错误的判断：
```ecmascript 6
const apiCore = getApi(process.env.SOME_API_BASE_URL)
const api = async (...args)=> {
    const response = await apiCore(...args) // 假设响应的内容：{ok: true, data: {id: 1, name: '张三'}} 或者 {ok: false, error: '用户不存在'}
    const {ok, data, error} = await response.json() // 将响应的内容转换为json对象，并直接解构到 ok、data、error这三个变量中
    if(ok) return data // data的值：{id: 1, name: '张三'}
    throw error // error: '用户不存在'
}
```
