const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  responses: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: "Questions" },
      selectedOption: { type: String, enum: ["responseA", "responseB"] },
    },
  ],
});

//pre-save hook to encrypt user passowrds on signup
userSchema.pre('save', function(next) {
  const user = this
  if(!user.isModified("password")) return next()
  bcrypt.hash(user.password, 10, (err, hash) => {
      if(err) return next(err)
      user.password = hash
    next()
  })
})

//method to check encrypted password on login
userSchema.methods.checkPassword = function(passowrdAttept, callback){
  bcrypt.compare(passowrdAttept, this.password, (err, isMatch) => {
    if(err) return callback(err)
    return callback(null, isMatch)
  })
}

//method to remove user's password for toke/sending the response
userSchema.methods.withoutPassword = function(){
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model("User", userSchema);
