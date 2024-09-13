// 导入 Joi 来定义验证规则
const Joi = require('joi')
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi');
const { query } = require('express');

const id = Joi.string().required();
const title = Joi.string().required();
const cate_id = Joi.string().required();

const content = Joi.string().required().allow("");
const state = Joi.string().valid("已发布", "草稿").required();

const pagenum = Joi.number().required();
const pagesize = Joi.number().required();


const add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }
}

const get_article_schema = {
    body: {
        id,
    }
}

const update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state,
    }
}

const delete_article_schema = {
    body: {
        id,
    }
}

const get_article_list_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: Joi.string(),
        state: Joi.string().valid("已发布", "草稿"),
    }
}

module.exports = {
    add_article_schema,
    get_article_schema,
    update_article_schema,
    delete_article_schema,
    get_article_list_schema,
}

