const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema(
  {
    //trazer isso da pokeapi
    pokeId: {
      type: Number,
      required: [true, 'pokeId eh obrigatorio'],
      unique: true,
      min: [1, 'pokeId deve ser > zero'],
    },
    name: {
      type: String,
      required: [true, 'name eh obrigatório'],
      trim: true,
      lowercase: true,
    },
    types: {
      type: [String],
      default: [],
    },
    height: Number,
    weight: Number,
    sprite: String,
    abilities: {
      type: [String],
      default: [],
    },

    //capos do user
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'nickname deve ter no max 50 caracteres'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [350, 'notes deve ter no max 350 caracteres'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pokemon', pokemonSchema);