const express = require('express');
const router = express.Router();

const scrapeBetano = require('../services/scrapers/betano');
const scrapeBetsul = require('../services/scrapers/betsul');
const scrapeSportingbet = require('../services/scrapers/sportingbet'); // ✅ Mantido

router.get('/', async (req, res) => {
  console.log('Iniciando scrapers...');
  try {
    const [betanoOdds, betsulOdds, sportingbetOdds] = await Promise.all([
      scrapeBetano(),
      scrapeBetsul(),
      scrapeSportingbet(), // ✅ Adicionado ao Promise.all
    ]);

    const combinedOdds = [
      ...betanoOdds,
      ...betsulOdds,
      ...sportingbetOdds, // ✅ Adicionado ao array final
    ];

    console.log('Scrapers finalizados!');
    console.log('Odds combinadas:', combinedOdds);

    res.json({ success: true, data: combinedOdds });
  } catch (error) {
    console.error('Erro ao obter odds:', error);
    res.json({ success: false, error: 'Erro ao obter odds' });
  }
});

module.exports = router;
