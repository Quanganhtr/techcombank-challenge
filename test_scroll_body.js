const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/nb_0_initial.png' });

  await page.mouse.move(700, 600);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/nb_1_mid.png' });

  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/nb_2_stuck.png' });

  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/nb_3_more.png' });

  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/nb_4_scrollback.png' });

  await browser.close();
})();
