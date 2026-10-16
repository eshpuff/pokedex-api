const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'nome é obrigatório'],
      trim: true,
      maxlength: [80, 'nome deve ter no máximo 80 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'email inválido'],
    },
    password: {
      type: String,
      required: [true, 'senha é obrigatório'],
      minlength: [6, 'senha deve ter no mínimo 6 caracteres'],
      select: false, 
    },
  },
  {
    timestamps: true,
  }
);

//transforma senha em hash
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//comparar senha com hash
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

//remover campos sensiveis do retorno
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);