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
router.post('/addCart',function(req,res,next){
    let userId = '100000077';
    let productId = req.body.productId;
    let User = require('../models/user');
    User.findOne({userId},function (err,userDoc){
        if(err){
            res.json({
                status: "1",
                msg:err.message
            })
        }else{
            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach((item) => {
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                })
                if(goodsItem){
                    userDoc.save(function(err2,doc){
                        if(err2){
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        }else{
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'suc'
                            })
                        }
                    })
                }else{
                    Goods.findOne({productId},function(err,GoodsDoc){
                        if(err){
                            res.json({
                                status: "1",
                                msg:err.message
                            })
                        }else{
                            if(GoodsDoc){
                                GoodsDoc.productNum = 1;
                                GoodsDoc.checked = 1;
                                userDoc.cartList.push(GoodsDoc);
                                userDoc.save(function(err2,doc){
                                    if(err2){
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    }else{
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
                
               
            }
        }
    })

})
module.exports = router