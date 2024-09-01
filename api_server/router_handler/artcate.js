const db = require('../db/index');
const uuid = require('uuid');

exports.getArticleCates = (req, res) => {
    // is_delete 为 0 表示没有被标记为删除的数据
    const sql = `select * from ev_article_cate where is_delete = 0 order by id asc`

    db.query(sql, (err, results) => {
        if (err) return res.cc(err);

        res.send({
            status: 0,
            message: "获取文章分类列表成功！",
            data: results,
        })
    })

    // res.send("OK")
}

exports.addArticleCates = (req, res) => {
    // 新增分类名称
    const sql = `select * from ev_article_cate where (name = ? or alias = ?) and is_delete = 0`;

    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length >= 2) return res.cc("分类名称与别名被占用，请更换后重试！")
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc("分类名称被占用，请更换后重试！")
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc("分类别名被占用，请更换后重试！")

        //  TODO: 新增文章分类
        const sql = `insert into ev_article_cate set ?`;
        const uid = uuid.v4().replace(/-/g, '');
        db.query(sql, [{ ...req.body, id: uid }], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("新增文章分类失败");

            res.cc("新增文章分类成功！", 0);
        })
    })
}

exports.deleteCateById = (req, res) => {
    // 根据ID删除文章分类
    const sql = `update ev_article_cate set is_delete = 1 where id = ? and is_delete = 0`;

    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("删除文章分类失败！");

        res.cc("删除文章分类成功！", 0);
    });
}

exports.getArticleById = (req, res) => {
    // 根据ID获取文章分类
    const sql = `select * from ev_article_cate where id = ? and is_delete = 0`;

    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("获取文章分类失败！");

        res.send({
            status: 0,
            message: "获取文章分类成功！",
            data: results[0],
        });
    });
}

exports.updateArticleById = (req, res) => {
    // 根据ID更新文章分类
    const sql = `select * from ev_article_cate where (name = ? or alias = ?) and is_delete = 0`;

    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err);
        if (results.length >= 2) return res.cc("分类名称与别名被占用，请更换后重试！")
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc("分类名称被占用，请更换后重试！")
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc("分类别名被占用，请更换后重试！")


        const sql = `update ev_article_cate set ? where id = ? and is_delete = 0`;
        console.log(req.body);
        
        db.query(sql, [req.body, req.body.id], (err, results) => {
            console.log(results);            
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc("更新文章分类失败！");

            res.cc("更新文章分类成功！", 0);
        });
    });


}