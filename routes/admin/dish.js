const express = require('express');
const pool = require('./pool');
var router = express.Router();
module.exports = router;

router.get('/',(req,res)=>{
    //为了获取所有菜品，必须先查询菜品类别
    pool.query('SELECT cid,cname FROM xfn_category ORDER BY cid',(err,result)=>{
        if(err) throw err;
        var categoryList=result;  //类别列表
        var finishCount=0;  //已经查询完菜品的类别的数量
        //循环遍历每个菜品类别，查询该类别下有哪些菜品
        for(let c of categoryList){
            pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',c.cid,(err,result)=>{
                if(err) throw err;
                c.dishList=result;
                finishCount++
                //必须保证所有的类别下的菜品都查询完才能发送响应消息
                if(finishCount==categoryList.length){
                    res.send(categoryList);
                }
            })
        }
    })
})