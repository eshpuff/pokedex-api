require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/database');
const pokemonRoutes = require('./routes/pokemon-routes');
const pokeapiRoutes = require('./routes/pokeapi-routes');
const authRoutes = require('./routes/auth-routes');

const path = require('path');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/pokeapi', pokeapiRoutes);
app.use('/pokemon', pokemonRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res) => {
    res.status(404).json({message: 'rota não encontrada.'});
});

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });
});