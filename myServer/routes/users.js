var express = require('express');
var router = express.Router();
let User = require('../models/user')
require('./../util/util')
/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('respond with a resource');
});
//登录接口
router.post('/login',function(req,res,next){
  let param = {
    userName : req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else{
      if(doc){
        res.cookie('userId',doc.userId,{
          path: '/',
          maxAge: 1000*60*60
        })
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge: 1000*60*60
        })
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

//登出接口
router.post('/logOut',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.cookie('userName','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status: '0',
    msg: '登出成功!',
    result: ''
  })
})

//登录校验
router.post('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  }else{
    res.json({
      status: '1',
      msg:'',
      result: ''
    })
  }
})
router.get('/cartList',(req,res,next) => {
  let userId = req.cookies.userId;
  User.findOne({userId},(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      if(doc){
        res.json({
          status: '0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
router.post('/cartDel',(req,res,next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({
    userId},
    {$pull:{
      'cartList':{productId}
    }
  },(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//修改商品数量
router.post("/cartEdit",(req,res,next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  User.update({userId,'cartList.productId':productId},{
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  },(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//全选
router.post('/editCheckAll',(req,res,next) => {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1': '0';
  User.findOne({userId},(err,user) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      if(user){
        user.cartList.forEach(item => {
          item.checked = checkAll;
        });
        user.save((err1,doc) => {
          if(err1){
            res.json({
              status: '1',
              msg:err.message,
              result: ''
            })
          }else{
            res.json({
              status: '0',
              msg:'',
              result: 'suc'
            })
          }
        })
      }
    }
  })
})

// 获取地址
router.get('/addressList',(req,res,next) => {
  let userId = req.cookies.userId;
  User.findOne({userId},(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg:'',
        result: doc.addressList
      })
    }
  })
})

//设置默认地址
router.post('/setDefault',(req,res,next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status: '1003',
      msg:'adressId is null',
      result: ''
    })
    return;
  }
  User.findOne({userId},(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      let addressList = doc.addressList;
      addressList.forEach(item => {
        if(item.addressId == addressId){
          item.isDefault = true;
        }else{
          item.isDefault = false;
        }
      });
      doc.save((err1,doc1) => {
        if(err1){
          res.json({
            status: '1',
            msg:err1.message,
            result: ''
          })
        }else{
          res.json({
            status: '0',
            msg:'',
            result: ''
          })
        }
      })
    }
  })
})

router.post('/delAddress',(req,res,next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({userId},{
    $pull:{
      'addressList':{
        addressId
      }
    }
  },(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      res.json({
        status: '0',
        msg:'',
        result: 'suc'
      })
    }
  })
})

router.post('/payMent',(req,res,next) => {
  let userId = req.cookies.userId;
  let orderTotal = req.body.orderTotal;
  let addressId = req.body.addressId;
  User.findOne({userId},(err,doc) => {
    if(err){
      res.json({
        status: '1',
        msg:err.message,
        result: ''
      })
    }else{
      let address = ''
      //获取当前用户的地址信息
      doc.addressList.forEach(item => {
        if(addressId == item.addressId){
          address = item;
        }
      });
      
      //获取用户购物车的购买商品
      let goodList = [];
      doc.cartList.filter(item => {
        if(item.checked == '1'){
          goodList.push(item);
        }
      })

      let platform = '622';
      let r1 = Math.floor(Math.random() * 10);
      let r2 = Math.floor(Math.random() * 10);
      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      let orderId = platform+r1+sysDate+r2

      let order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodList: goodList,
        createDate:createDate
      }

      doc.orderList.push(order);
      doc.save((err1,doc1) => {
        if(err1){
          res.json({
            status: '1',
            msg:err.message,
            result: ''
          })
        }else{
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})
//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
  let userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId}, function (err,userInfo) {
      if(err){
          res.json({
             status:'1',
             msg:err.message,
             result:''
          });
      }else{
         let orderList = userInfo.orderList;
         if(orderList.length>0){
           let orderTotal = 0;
           orderList.forEach((item)=>{
              if(item.orderId == orderId){
                orderTotal = item.orderTotal;
              }
           });
           if(orderTotal>0){
             res.json({
               status:'0',
               msg:'',
               result:{
                 orderId:orderId,
                 orderTotal:orderTotal
               }
             })
           }else{
             res.json({
               status:'120002',
               msg:'无此订单',
               result:''
             });
           }
         }else{
           res.json({
             status:'120001',
             msg:'当前用户未创建订单',
             result:''
           });
         }
      }
  })
});

router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
});
module.exports = router;
