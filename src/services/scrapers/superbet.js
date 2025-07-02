const puppeteer = require('puppeteer');

const scrapeSuperBet = async () => {
  const browser = await puppeteer.launch({
    headless: false, // Deixe visible para debug
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  // User-Agent realista
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );

  console.log('Acessando Super Bet...');

  try {
    await page.goto('https://superbet.bet.br/apostas/ao-vivo', {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });

    await page.waitForTimeout(10000); // Espera JS carregar

    await page.waitForSelector('.match__teams', { timeout: 30000 });

    const matches = await page.$$eval('.match', (matchEls) => {
      return matchEls.map((matchEl) => {
        const timeCasa = matchEl.querySelector('.match__teams span:nth-child(1)')?.textContent.trim() || '';
        const timeFora = matchEl.querySelector('.match__teams span:nth-child(2)')?.textContent.trim() || '';

        const oddsEl = matchEl.querySelectorAll('.match__odds .match__odd');
        const oddCasa = oddsEl[0]?.textContent.trim() || '';
        const oddEmpate = oddsEl[1]?.textContent.trim() || '';
        const oddFora = oddsEl[2]?.textContent.trim() || '';

        return {
          partida: `${timeCasa} x ${timeFora}`,
          odds: {
            casa: parseFloat(oddCasa.replace(',', '.')) || 0,
            empate: parseFloat(oddEmpate.replace(',', '.')) || 0,
            fora: parseFloat(oddFora.replace(',', '.')) || 0,
          },
        };
      });
    });

    await browser.close();
    return matches;
  } catch (error) {
    console.error('Erro ao raspar Super Bet:', error);
    await browser.close();
    return [];
  }
};

module.exports = scrapeSuperBet;
