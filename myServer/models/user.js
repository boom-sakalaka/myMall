var mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [
        {
            "productId": String,
            "productName": String,
            "productImage": String,
            "salePrice": Number,
            "checked": String,
            "productNum": String
        }
    ],
    "addressList": Array
    
})

module.exports = mongoose.model('User',userSchema)