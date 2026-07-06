const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const sticky = document.querySelector('.sticky');
    const cs = getComputedStyle(sticky);
    return { top: cs.top, position: cs.position, display: cs.display, alignSelf: cs.alignSelf, flexShrink: cs.flexShrink, height: sticky.getBoundingClientRect().height };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
