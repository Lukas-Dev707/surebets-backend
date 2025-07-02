const scraperBet365 = require("../services/scrapers/bet365");

async function getOddsBet365(req, res) {
  try {
    const data = await scraperBet365();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Erro ao coletar dados da Bet365:", error);
    res.status(500).json({ success: false, message: "Erro ao coletar dados da Bet365" });
  }
}

module.exports = { getOddsBet365 };
