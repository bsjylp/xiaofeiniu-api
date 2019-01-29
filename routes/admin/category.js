const express = require('express');
const pool = require('./pool');
var router = express.Router();
module.exports = router;

/**
 * API GET/admin/category
 * 含义 客户端获取所有的菜品类别，按编号升序排列
 * 返回值形如 [{cid:1,cname:'...'},{...}]
 */
router.get('/', (req, res) => {
    pool.query('SELECT * FROM xfn_category ORDER BY cid', (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

/**
* API DELETE/admin/category/:cid=3
* 含义 客户端获取所有的菜品类别，按编号升序排列
* 返回值形如 [{cid:1,cname:'...'},{...}]
*/

router.delete('/:cid', (req, res) => {
    //注意删除菜品类别必须先把属于该类别的菜品的类别编号设置为null
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?', req.params.cid, (err, result) => {
        if (err) throw err;
        //至此指定类别的菜品已经修改完毕
        pool.query('DELETE FROM xfn_category WHERE cid=?', req.params.cid, (err, result) => {
            if (err) throw err
            //获取DELETE语句在数据库中影响的行数
            if (result.affectedRows > 0) {
                res.send({ code: 200, msg: '1 category deleted' })
            } else {
                res.send({ code: 400, msg: '0 category deleted' })
            }
        })
    })
})


/**
 * post/admin/category
 * 添加新的菜品类别
 * 返回值为  {code:200,msg:'1 category added',cid:x}
 */

 router.post('/',(req,res)=>{
     var data=req.body;  //形如 {cname:'xxx'}
     pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{
        //注意此处SQL语句的简写
        if(err) throw err;
        res.send({code:200,msg:'1 category added'})
     })
 })


 /**
  * put /admin/category
  * 请求参数
  * 返回值形如 
  * {code:200,msg:'1  ..'}
  * {code:400,msg:'0  ..'}
  * {code:401,msg:'0  ..'}
  */

router.put('/',(req,res)=>{
    console.log(req.body)
    var data=req.body;  //请求数据 {cid:xx,cname:'xx'}
    //TODO  此处可以对数据进行验证
    pool.query('UPDATE xfn_category SET ? WHERE cid=?',[data,data.cid],(err,result)=>{
        if(err) throw err;
        if(result.changedRows>0){
            res.send({code:200,msg:'1 category modified'})
        }else if(result.affectedRows==0){
            res.send({code:400,msg:'category not exists'})
        }else if(result.affectedRows==1 && result.changedRows==0){
            //新值与旧值安全一样
            res.send({code:401,msg:'no category modified'})
        }
    })
})