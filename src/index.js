const express = require('express');
const cors = require('cors');
const oddsRoutes = require('./routes/odds.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Rota principal de odds
app.use('/odds', oddsRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
