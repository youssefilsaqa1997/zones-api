const mongoose = require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  mobile:{
      type:String,
      required:true,
      minlength:11,
      trim:true,
      unique:true,
  },
  password:{
      type:String,
      required:true,
      minlength:3
  },
  name:{
      type:String
  }
});



UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'ilsaqa', {expiresIn: "120 days" }).toString();
  return token;
};

var User = mongoose.model('User', UserSchema);

module.exports={
    User
}