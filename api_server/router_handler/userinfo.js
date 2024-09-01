const db = require('../db/index')
const bcrypt = require('bcryptjs');

exports.getUserInfo = (req, res) => {
    // 获取用户信息
    const sql = `select id, username, nickname,email,user_pic from ev_users where id = ?`;

    db.query(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err);
        console.log(typeof results.lenght);

        if (results.length !== 1) return res.cc("获取用户信息失败！");

        res.send({
            status: 0,
            message: "获取用户基本信息成功！",
            data: results[0],
        })
    })

    // res.send("OK");
}

exports.updateUserInfo = (req, res) => {
    // 更新用户信息
    const sql = `update ev_users set ? where id = ?`;

    // console.log(req.body);
    // console.log(req.auth);

    db.query(sql, [req.body, req.auth.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败！");

        res.cc("修改用户基本信息成功！", 0);
    })
}

exports.updatePassword = (req, res) => {
    // 重置密码
    const sql = `select * from ev_users where id = ?`;

    db.query(sql, req.auth.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("用户不存在！");

        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc("旧密码不正确！");
    })

    //对新密码进行加密并更新
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    const sql_update = `update ev_users set password = ? where id = ?`;
    db.query(sql_update, [newPwd, req.auth.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("重置密码失败！");

        res.cc("重置密码成功！", 0);
    })


    // res.cc("OK", 0)
}


exports.updateAvatar = (req, res) => {
    // 更换头像
    const sql = `update ev_users set user_pic = ? where id = ?`;

    db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("更换头像失败！");

        res.cc("更换头像成功", 0);
    })

    // res.cc("OK", 0)
}