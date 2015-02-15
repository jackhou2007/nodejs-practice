var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wechat');

exports.User = mongoose.model('User', require('./user'));