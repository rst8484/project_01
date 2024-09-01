const express = require('express');
const route = express.Router();

const multer = require('multer');
const path = require('path')
const upload = multer({
    data: path.join(__dirname, "../uploads")
})

const expressJoi = require('@escook/express-joi')
const {
    add_article_schema,
    get_article_schema,
    update_article_schema,
    delete_article_schema,
    get_article_list_schema,
} = require('../schema/article')

const articleHandler = require('../router_handler/article');

route.post("/add", upload.single("cover_img"), expressJoi(add_article_schema), articleHandler.addArticle);

route.get("/getAll", upload.single("cover_img"), articleHandler.getArticle);

route.get("/list", upload.single("cover_img"), expressJoi(get_article_list_schema), articleHandler.getArticleList);

route.post("/getById", upload.single("cover_img"), expressJoi(get_article_schema), articleHandler.getArticleById);

route.post("/updateById", upload.single("cover_img"), expressJoi(update_article_schema), articleHandler.updateArticleById);

route.post("/deleteById", upload.single("cover_img"), expressJoi(delete_article_schema), articleHandler.deleteArticleById);



module.exports = route;