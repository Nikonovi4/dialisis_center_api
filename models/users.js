const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 40,
  },
  login: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 12,
  },
  post: {
    type: String,
    required: true,
    enum: ['Инженер', 'Ведущий инженер','Главный инженер']
  },
  center: {
    type: String,
    enum: ['Научный', 'Солнцево', 'Нагатинская', 'Братиславская',]
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 5,
  }
})

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);