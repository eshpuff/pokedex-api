const jwt = require('jsonwebtoken');
const User = require('../models/user');

function handleError(error, res) {
  if (error.code === 11000) {
    return res.status(409).json({ message: 'esse email já está cadastrado' });
  }

  //erros
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'erro interno do servidor' });
}

//post
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res
        .status(400)
        .json({ message: 'nome, email e senha são obrigatórios' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json(user);
  } catch (error) {
    return handleError(error, res);
  }
}

//post
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res
        .status(400)
        .json({ message: 'email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password'
    );

    const validPassword = user && (await user.comparePassword(password));

    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.json({ token, user });
  } catch (error) {
    return handleError(error, res);
  }
}

module.exports = { register, login };