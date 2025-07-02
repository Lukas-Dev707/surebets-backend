const puppeteer = require('puppeteer-core');
const fs = require('fs');

module.exports = async function scrapeBet365() {
  try {
    console.log('Acessando Bet365...');

    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.bet365.bet.br/#/IP/B1', { waitUntil: 'domcontentloaded', timeout: 0 });

    // Aguarda tentativa de renderização (aumentamos o tempo para debugging)
    await page.waitForTimeout(8000);

    // Screenshot e HTML para debug
    await page.screenshot({ path: 'bet365.png', fullPage: true });
    const html = await page.content();
    fs.writeFileSync('bet365.html', html);

    // Aguarda o seletor do bloco de jogo
    await page.waitForSelector('.ovm-FixtureDetailsTwoWay', { timeout: 30000 });

    const partidas = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.ovm-FixtureDetailsTwoWay');
      const resultado = [];

      elementos.forEach((el) => {
        const times = el.querySelectorAll('.ovm-FixtureDetailsTwoWay_TeamName');
        const odds = el.querySelectorAll('.ovm-ParticipantOddsOnly_Odds');

        if (times.length === 2 && odds.length === 3) {
          resultado.push({
            partida: `${times[0].innerText} x ${times[1].innerText}`,
            odds: {
              casa: parseFloat(odds[0].innerText.replace(',', '.')),
              empate: parseFloat(odds[1].innerText.replace(',', '.')),
              fora: parseFloat(odds[2].innerText.replace(',', '.')),
            },
          });
        }
      });

      return resultado;
    });

    await browser.close();
    return partidas;
  } catch (err) {
    console.error('Erro ao raspar Bet365:', err);
    return [];
  }
};
