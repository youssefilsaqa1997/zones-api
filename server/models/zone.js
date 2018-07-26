var mongoose = require('mongoose')

var creation =mongoose.model('zone',{
    label:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    color:{
        type:String,
        required:true
    },
    points:{
        type:Array,
        required:true
        
    }
});

module.exports={
    creation
}