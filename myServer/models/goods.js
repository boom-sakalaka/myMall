var mongoose = require('mongoose')
var Schema = mongoose.Schema

var porductSchema = new Schema({
    "productId": String,
    "productName": String,
    "productImage": String,
    "salePrice": Number,
})

module.exports = mongoose.model('Good',porductSchema)