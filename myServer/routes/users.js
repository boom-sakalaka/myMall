var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/test', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',function(req,res,next){
  res.json({
    status: '0',
    msg: "2344444"
  })
})
module.exports = router;
