/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

const db = require('../db/index');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require("jsonwebtoken");
const config = require('../config');


// 注册用户 处理函数
exports.regUser = (req, res) => {
    // 判断用户名密码是否为空    
    const userinfo = req.body;
    if (!userinfo.username || !userinfo.password) {
        res.cc("用户名或密码不能为空！");
        // return res.send({
        //     status: 1,
        //     message: "用户名或密码不能为空！"
        // });
    }

    // 检测用户名是否被占用
    const sql_s = `select * from ev_users where username = ?`;

    db.query(sql_s, [userinfo.username], (err, results) => {
        // 执行sql失败处理
        if (err) {
            res.cc(res);
            // return res.send({
            //     status: 1,
            //     message: err.message
            // });
        }

        // 用户名被占用
        if (results.lentch > 0) {
            res.cc("用户名被占用，请更换其它用户名");
            // return res.send({
            //     status: 1,
            //     message: "用户名被占用，请更换其它用户名"
            // }); 

        }
    })

    // 对密码进行加密处理
    // 使用bcrypt模块进行密码加密，返回加密后的字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    // 插入新用户
    const id = uuid.v4().replace(/-/g, '');
    userinfo.id = id;
    const sql_i = `insert into ev_users set ?`;

    db.query(
        sql_i,
        {
            id: userinfo.id,
            username: userinfo.username,
            password: userinfo.password
        },
        (err, results) => {
            if (err) {
                res.cc("注册用户失败，请稍后再试！");
                // return res.send({
                //     status: 1,
                //     message: "注册用户失败，请稍后再试！"
                // });
            }

            res.send({
                status: 0,
                message: "注册成功！"
            });
        }
    )

    // res.send("reguser OK")
}

// 登录 处理函数
exports.login = (req, res) => {
    // 根据用户名查询用户的数据为1
    const userinfo = req.body;
    const sql_s = `select * from ev_users where username = ?`;
    db.query(sql_s, [userinfo.username], (err, results) => {
        // 执行sql失败处理
        if (err) {
            res.cc(res);
        }
        if (results.length !== 1) {
            return res.cc("登录失败！");
        }

        // 判断用户输入的密码是否正确
        const compareResult = bcrypt.compareSync(
            userinfo.password,
            results[0].password
        );

        if (!compareResult) {
            return res.cc("登录失败！");
        }

        // 生成 JWT 的 Token 字符串
        const user = { ...results[0], password: "", user_pic: "" };
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '1h', })

        res.send({
            status: 0,
            message: "登录成功！",
            token: "Bearer " + tokenStr
        })
    })



    // res.send("login OK")
}