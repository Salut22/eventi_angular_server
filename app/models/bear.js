var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

module.exports = mongoose.model('Bear', new Schema({
    name: String,
    password: String,
    admin: Boolean,
    time1log: Number,
    counter: Number,
    differenzaTempo: Number,
    timeLastRequest:Number
}));


