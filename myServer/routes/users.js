var express = require('express');
var router = express.Router();
let User = require('../models/user')
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
module.exports = router;
