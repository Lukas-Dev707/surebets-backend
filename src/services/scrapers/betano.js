const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function scrapeBetano() {
  console.log("Acessando Betano...");

 const browser = await puppeteer.launch({
  headless: chromium.headless,
  executablePath: await chromium.executablePath(),
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
});


  const page = await browser.newPage();

  try {
    await page.goto('https://www.betano.bet.br/live/', { timeout: 0 });

    await page.waitForFunction(() => {
      return document.querySelectorAll('[data-qa="event-card"]').length > 0;
    }, { timeout: 60000 });

    const games = await page.$$eval('[data-qa="event-card"]', cards => {
      const resultados = [];

      for (const card of cards) {
        const teamElements = card.querySelectorAll('div.tw-truncate');
        const oddElements = card.querySelectorAll('span.tw-text-s');

        if (teamElements.length >= 2 && oddElements.length >= 3) {
          const partida = `${teamElements[0].textContent.trim()} x ${teamElements[1].textContent.trim()}`;
          resultados.push({
            partida,
            odds: {
              casa: parseFloat(oddElements[0].textContent.replace(',', '.')),
              empate: parseFloat(oddElements[1].textContent.replace(',', '.')),
              fora: parseFloat(oddElements[2].textContent.replace(',', '.')),
            }
          });
        }
      }

      return resultados;
    });

    await browser.close();
    return games;
  } catch (error) {
    console.error('Erro ao raspar Betano:', error);
    await browser.close();
    return [];
  }
}

module.exports = scrapeBetano;
