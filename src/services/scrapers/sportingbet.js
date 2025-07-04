const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function scrapeSportingbet() {
  console.log('Acessando Sportingbet...');

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });

  const page = await browser.newPage();
  await page.goto('https://www.sportingbet.bet.br/pt-br/sports/ao-vivo/futebol-4', {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  await page.waitForSelector('ms-event-group');

  const odds = await page.evaluate(() => {
    const partidas = [];
    const grupos = document.querySelectorAll('ms-event-group');

    grupos.forEach(grupo => {
      const times = grupo.querySelectorAll('.participant');
      const oddsSpans = grupo.querySelectorAll('.custom-odds-value-style');

      if (times.length === 2 && oddsSpans.length >= 3) {
        const timeCasa = times[0]?.textContent?.trim() || '';
        const timeFora = times[1]?.textContent?.trim() || '';
        const partida = `${timeFora} x ${timeCasa}`;

        const casa = parseFloat(oddsSpans[0]?.textContent) || 0;
        const empate = parseFloat(oddsSpans[1]?.textContent) || 0;
        const fora = parseFloat(oddsSpans[2]?.textContent) || 0;

        partidas.push({
          partida,
          odds: { casa, empate, fora }
        });
      }
    });

    return partidas;
  });

  await browser.close();
  return odds;
}

module.exports = scrapeSportingbet;
