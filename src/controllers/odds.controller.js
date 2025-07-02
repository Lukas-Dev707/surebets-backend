const scrapeSuperBet = require("../scrapers/superbet");
const surebetAnalyzer = require("../services/surebetAnalyzer");

exports.getOdds = async (req, res) => {
  try {
    const oddsSuperBet = await scrapeSuperBet();
    const result = surebetAnalyzer(oddsSuperBet); // retorna surebets

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Erro ao buscar odds:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar odds" });
  }
};
