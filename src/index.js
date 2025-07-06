const express = require('express');
const cors = require('cors');
const oddsRoutes = require('./routes/odds.routes');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Usa as rotas definidas no arquivo que você mostrou
app.use('/odds', oddsRoutes);

const PORT = process.env.PORT || 3000; // usa porta do Render ou 3000 local
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
