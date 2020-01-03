var mongoose = require('mongoose')
var Schema = mongoose.Schema

var porductSchema = new Schema({
    "productId": String,
    "productName": String,
    "productImage": String,
    "salePrice": Number,
    "checked": String,
    "productNum": String
})

module.exports = mongoose.model('Good',porductSchema)