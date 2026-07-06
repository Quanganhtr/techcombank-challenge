const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const sticky = document.querySelector('.sticky');
    let el = sticky;
    const chain = [];
    while (el) {
      const cs = getComputedStyle(el);
      chain.push({ tag: el.tagName, cls: el.className.slice(0,60), position: cs.position, transform: cs.transform, overflow: cs.overflow, overflowY: cs.overflowY });
      el = el.parentElement;
      if (chain.length > 10) break;
    }
    return chain;
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
