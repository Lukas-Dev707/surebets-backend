const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function scrapeBetano() {
  console.log('Acessando Betano...');
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(), // ESSA linha é crucial!
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });


  const page = await browser.newPage();
  await page.goto('https://betsul.bet.br/esportes/ao-vivo', { waitUntil: 'networkidle2', timeout: 0 });

  try {
    await page.waitForSelector('.we-eventlist-item', { timeout: 30000 });

    const games = await page.evaluate(() => {
      const items = document.querySelectorAll('.we-eventlist-item');
      const results = [];

      items.forEach(item => {
        const times = item.querySelectorAll('div[data-v-14363096]');
        const odds = item.querySelectorAll('.odd-value');

        if (times.length >= 2 && odds.length >= 3) {
          const timeCasa = times[0].innerText.trim();
          const timeFora = times[1].innerText.trim();
          const oddCasa = parseFloat(odds[0].innerText.replace(',', '.'));
          const oddEmpate = parseFloat(odds[1].innerText.replace(',', '.'));
          const oddFora = parseFloat(odds[2].innerText.replace(',', '.'));

          results.push({
            partida: `${timeCasa} x ${timeFora}`,
            odds: {
              casa: oddCasa,
              empate: oddEmpate,
              fora: oddFora,
            },
          });
        }
      });

      return results;
    });

    await browser.close();
    return games;
  } catch (error) {
    console.error('Erro ao raspar Betsul:', error);
    await browser.close();
    return [];
  }
}

module.exports = scrapeBetsul;
