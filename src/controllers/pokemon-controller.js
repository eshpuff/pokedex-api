const mongoose = require('mongoose');
const Pokemon = require('../models/pokemon');

const EDITABLE_FIELDS = ['nickname', 'notes', 'favorite'];

function handleError(error, res) {
  //podeid ja cadastrado
  if (error.code === 11000) {
    return res
      .status(409)
      .json({ message: 'já existe um pokémon com esse pokeId no catálogo' });
  }

  //erros de validação
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'erro interno do servidor...' });
}

// POST
async function create(req, res) {
  try {
    const pokemon = await Pokemon.create(req.body);
    return res.status(201).json(pokemon);
  } catch (error) {
    return handleError(error, res);
  }
}

// GET
async function list(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const filter = {};
    if (req.query.type) {
      filter.types = req.query.type.toLowerCase();
    }

    const [data, total] = await Promise.all([
      Pokemon.find(filter)
        .sort({ pokeId: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Pokemon.countDocuments(filter),
    ]);

    return res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleError(error, res);
  }
}

// GET
async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'id invalida' });
    }

    const pokemon = await Pokemon.findById(id);

    if (!pokemon) {
      return res.status(404).json({ message: 'pokémon n encontrado' });
    }

    return res.json(pokemon);
  } catch (error) {
    return handleError(error, res);
  }
}

// PATCH
async function update(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'id invalida' });
    }

    // apenas campos editaveis
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: `envie ao menos um campo editável: ${EDITABLE_FIELDS.join(', ')}`,
      });
    }

    const pokemon = await Pokemon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon não encontrado' });
    }

    return res.json(pokemon);
  } catch (error) {
    return handleError(error, res);
  }
}

// DELETE
async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const pokemon = await Pokemon.findByIdAndDelete(id);

    if (!pokemon) {
      return res.status(404).json({ message: 'pokémon não encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(error, res);
  }
}

module.exports = { create, list, getById, update, remove };