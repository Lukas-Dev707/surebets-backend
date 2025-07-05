const express = require('express');
const router = express.Router();

const scrapeBetano = require('../services/scrapers/betano');
const scrapeBetsul = require('../services/scrapers/betsul');
const scrapeSportingbet = require('../services/scrapers/sportingbet'); // ✅ Certo

router.get('/', async (req, res) => {
  console.log('🔄 Iniciando scrapers...');

  try {
    // Executa os scrapers em paralelo
    const [betanoOdds, betsulOdds, sportingbetOdds] = await Promise.all([
      scrapeBetano(),
      scrapeBetsul(),
    //scrapeSportingbet(),
    ]);

    // Combina todas as odds em um único array
    const combinedOdds = [
      ...betanoOdds,
      ...betsulOdds,
      ...sportingbetOdds,
    ];

    console.log('✅ Scrapers finalizados!');
    console.log('📊 Odds combinadas:', combinedOdds);

    // Retorna os dados para o front-end
    res.json({ success: true, data: combinedOdds });
  } catch (error) {
    console.error('❌ Erro detalhado ao obter odds:', error);
    res.json({ success: false, error: 'Erro ao obter odds' });
  }
});

module.exports = router;
