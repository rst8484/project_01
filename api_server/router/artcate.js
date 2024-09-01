const express = require('express');

const router = express.Router();

const artcate_handler = require('../router_handler/artcate')

const expressJoi = require('@escook/express-joi')
const {
    add_cate_schema,
    del_cate_schema,
    get_cate_schema,
    update_cate_schema
} = require('../schema/user')



// 获取文章分类的列表数据
router.get('/cates', artcate_handler.getArticleCates);
// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates);
// 根据ID删除文章分类
router.get('/deletecate/:id', expressJoi(del_cate_schema), artcate_handler.deleteCateById);
// 根据ID获取文章分类
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArticleById);
// 根据ID更新文章分类
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateArticleById);


module.exports = router;