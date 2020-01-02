var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')


mongoose.connect('mongodb://127.0.0.1:27017/db_demo', { useNewUrlParser: true, useUnifiedTopology: true },function(err){
  if(err){
    console.log(err);
  }else{
    console.log('数据库连接成功');
  }
});

mongoose.connection.on('connected',function () {
    console.log('MongoDB is connected success');
})

mongoose.connection.on('disconnected',function () {
    console.log('MongoDB is connected disconnected')
})

router.get('/list',function (req,res,next){
    let page = parseInt(req.param("page"))
    let pageSize = parseInt(req.param("pageSize"))
    let sort = req.param("sort")
    let priceLevel = req.param('priceLevel')
    let skip = (page - 1) * pageSize

    let priceGt = ''
    let priceLte = ''
    let params = {};
    if(priceLevel != 'all'){
        switch(priceLevel){
            case '0': priceGt = 0;priceLte = 100; break;
            case '1': priceGt = 100;priceLte = 500; break;
            case '2': priceGt = 500;priceLte = 1000; break;
            case '3': priceGt = 1000;priceLte = 5000; break;
        }
        params = {
           salePrice:{
            $gt:priceGt,
            $lte:priceLte
           }
        }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize).sort({'salePrice':sort});
    goodsModel.exec({},function (err,doc) {
        if(err){
            res.json({
                status: '1',
                msg:err.message
            });
        }else{
            res.json({
                status: '0',
                msg: '',
                result:{
                    count: doc.length,
                    list:doc
                }
            })
        }
    })
})

module.exports = router