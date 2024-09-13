const path = require('path');
const db = require('../db/index');
const uuid = require('uuid');

exports.addArticle = (req, res) => {
    // console.log(req.body);
    // console.log('------------------------------');
    // console.log(req.file);

    if (!req.file || req.file.fieldname !== 'cover_img')
        return res.cc("文章封面是必填参数！")

    const articleInfo = {
        // 表单文本信息
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.fieldname),
        // 发布时间
        pub_date: new Date(),
        // 作者ID取当前用户ID
        author_id: req.auth.id,
        // 生成32位ID
        id: uuid.v4().replace(/-/g, ''),
    };

    const sql = `insert into ev_articles set ?`;
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("发布文章失败！");

        res.cc("发布文章成功！", 0)
    })
};


exports.getArticle = (req, res) => {
    // 获取文章列表数据
    const sql = `select * from ev_articles where is_delete = 0`;
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);

        res.send({
            status: 0,
            message: "获取文章列表数据成功！",
            data: results,
        })
    })
};

exports.getArticleList = (req, res) => {
    // 获取文章列表数据
    // let sql = `select * from ev_articles where is_delete = 0`;
    //  console.log(req);
    let total_count = 0;
    let sql = `select ea.id ,ea.title ,ea.pub_date ,ea.state ,eac.name as cate_name from ev_articles ea
                left join ev_article_cate eac
                on ea.cate_id = eac.id 
                where ea.is_delete = 0
                and eac.is_delete = 0`;
    if (req.query.cate_id) {
        sql += ` and ea.cate_id = '${req.query.cate_id}'`;
    }
    if (req.query.state) {
        sql += ` and ea.state = '${req.query.state}'`;
    }

    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        total_count = results.length;
        let offset = (req.query.pagenum - 1) * req.query.pagesize;
        sql += ` order by ea.pub_date desc limit ${offset}, ${req.query.pagesize}`;
    
        // console.log(sql);
        
        db.query(sql, (err, results) => {
            if (err) return res.cc(err);
    
            res.send({
                status: 0,
                message: "获取文章列表数据成功！",
                data: results,
                total: total_count,
            })
        })
    })

   
};

exports.getArticleById = (req, res) => {
    // 根据获取文章列表数据
    const sql = `select * from ev_articles where is_delete = 0 and id = ?`;
    db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("获取文章失败！");
        res.send({
            status: 0,
            message: "获取文章数据成功！",
            data: results[0],
        })
    })
};

exports.updateArticleById = (req, res) => {
    // 根据ID更新文章列表数据
    const sql = `select * from ev_articles where is_delete = 0 and id = ?`;
    db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("id不存在，更新失败！");

        const sql = `update ev_articles set ? where is_delete = 0 and id = ?`;
        const articleInfo = {
            // 表单文本信息
            ...req.body,
            // 文章封面在服务器端的存放路径
            cover_img: path.join('/uploads', req.file.fieldname),
        };
        db.query(sql, [articleInfo, req.body.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("更新文章失败！");
            res.send({
                status: 0,
                message: "更新文章数据成功！",
            })
        })
    })


};

exports.deleteArticleById = (req, res) => {
    // 根据ID删除文章列表数据
    const sql = `update ev_articles set is_delete = 1 where is_delete = 0 and id = ?`;
    db.query(sql, req.body.id, (err, results) => {
        console.log(results);
        
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("删除文章失败！");
        res.send({
            status: 0,
            message: "删除文章数据成功！",
            data: results[0],
        })
    })
};
