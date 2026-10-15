require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/database');
const pokemonRoutes = require('./routes/pokemon-routes')

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/pokemon', pokemonRoutes)

app.use((req, res) => {
    res.status(404).json({message: 'rota não encontrada.'});
});

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });
});