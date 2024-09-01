const express = require('express');
const cors = require('cors');
const joi = require('joi');
const config = require('./config');
// 解析token中间件
const { expressjwt } = require('express-jwt');

const app = express();

const hostname = '127.0.0.1';
const port = '3000';

// 导入cors中间件，解决跨域问题
app.use(cors());

// 托管静态资源文件
app.use('/uploads', express.static("./uploads"));

// 配置解析表单数据的中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 封装中间件函数进行失败报错处理
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status: status,
            message: err instanceof Error ? err.message : err
        })
    };
    next()
})

// 解析token，默认放在req.auth中
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] })
    .unless({ path: [/^\/api\//] }))

app.use((req, res, next) => {
    if (req.auth && req.auth.id) {
        // 确保 req.body 已经被解析（例如，使用 express.json() 或 express.urlencoded() 中间件）
        // 如果 req.body 不存在，则初始化它
        req.body = req.body || {};
        // 将 req.auth.id 的值复制到 req.body.id
        req.body.user_id = req.auth.id;
        console.log(req);
    }
    next();
});

// 错误中间件
app.use(function (err, req, res, next) {
    // Joi 参数校验失败
    if (err instanceof joi.ValidationError) return res.cc(err.message);
    // 捕获身份认证失败的错误
    if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
    // 未知错误
    res.cc(err);
})


// 导入并使用路由模块
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
const artCateRouter = require('./router/artcate')
const articleRouter = require('./router/article')


app.use('/api', userRouter)      // 绑定userRouter到前缀/api的请求
app.use('/my/article', artCateRouter)
app.use('/my/article', articleRouter)
app.use('/my', userinfoRouter)


// 调用 app.listen 方法，启用web服务器并打印提示信息
app.listen(port, hostname, () => {
    console.log(`api server running at http://${hostname}:${port}`);
})