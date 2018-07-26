var mongoose = require('mongoose')

mongoose.Promise =global.Promise;
mongoose.connect('mongodb://ilsaqa1997:mainmethod1@ds253831.mlab.com:53831/zones')

module.exports={mongoose};