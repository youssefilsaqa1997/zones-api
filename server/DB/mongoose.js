var mongoose = require('mongoose')

mongoose.Promise =global.Promise;
mongoose.connect('mongodb://<youssefilsaqa1997>:<Youssef.6>@ds253831.mlab.com:53831/zones')

module.exports={mongoose};