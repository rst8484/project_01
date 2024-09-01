// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')

const username = Joi.string().alphanum().min(3).max(12).required();
const password = Joi.string().pattern(/^[\S]{6,15}$/).required();
const id = Joi.string().required();
const nickname = Joi.string();
const email = Joi.string().email();
const oldPwd = password;
const newPwd = Joi.not(Joi.ref("oldPwd")).concat(password);
const avatar = Joi.string().dataUri().required();

const cate_name = Joi.string().required();
const cate_alias = Joi.string().alphanum().required();

const reg_login_schema = {
    // 2.1 校验 req.body 中的数据
    body: {
        username,
        password
    },
}

const update_userinfo_schema = {
    body: {
        id,
        nickname,
        email,
    },
}

const update_password_schema = {
    body: {
        oldPwd,
        newPwd,
    },
}

const update_avatar_schema = {
    body: {
        avatar,
    },
}

const add_cate_schema = {
    body: {
        name: cate_name,
        alias: cate_alias,
    }
}

const del_cate_schema = {
    params: {
        id,
    }
}

const get_cate_schema = {
    params: {
        id,
    }
}

const update_cate_schema = {
    body: {
        id: Joi.string().required(),
        name: Joi.string().required(),
        alias: Joi.string().alphanum().required(),
    }
}



module.exports = {
    reg_login_schema,
    update_userinfo_schema,
    update_password_schema,
    update_avatar_schema,
    add_cate_schema,
    del_cate_schema,
    get_cate_schema,
    update_cate_schema,
}