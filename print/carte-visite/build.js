// Génère la carte de visite à partir de carte.html :
//   carte-visite-impression.pdf  -> 2 pages 91×61 mm (fond perdu 3 mm inclus) : à envoyer à l'imprimeur
//   apercu-recto.png / apercu-verso.png -> aperçu à la coupe (85×55 mm), pour vérifier à l'écran
// Usage : node build.js   (depuis ce dossier ; nécessite Playwright)
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const here = __dirname;
  const url = 'file://' + path.join(here, 'carte.html');
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(here, 'carte-visite-impression.pdf'), width: '91mm', height: '61mm', printBackground: true, pageRanges: '1-2' });

  // aperçus : 300 dpi, rognés au format fini (on retire les 3 mm de fond perdu)
  const mm = 300 / 25.4;
  const shot = await b.newPage({ viewport: { width: 400, height: 600 }, deviceScaleFactor: mm / (96 / 25.4) });
  await shot.goto(url, { waitUntil: 'networkidle' });
  await shot.evaluate(() => document.fonts.ready);
  const cards = await shot.$$('.card');
  const pxPerMm = 96 / 25.4;
  for (const [i, name] of [[0, 'recto'], [1, 'verso']]) {
    const box = await cards[i].boundingBox();
    await shot.screenshot({ path: path.join(here, `apercu-${name}.png`),
      clip: { x: box.x + 3 * pxPerMm, y: box.y + 3 * pxPerMm, width: 85 * pxPerMm, height: 55 * pxPerMm } });
  }
  await b.close();
  console.log('ok — carte-visite-impression.pdf + apercu-recto.png + apercu-verso.png');
})();
