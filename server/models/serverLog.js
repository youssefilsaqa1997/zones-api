var mongoose = require('mongoose')

var LogHistory =mongoose.model('serverLog',{
    log:{
        type:String
    }, 
    requestBody:{
        type:Object
    }
});

module.exports={
    LogHistory
}