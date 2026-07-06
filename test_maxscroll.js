const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const sticky = document.querySelector('.sticky');
    const scrollContainer = sticky.closest('.overflow-y-auto');
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return { scrollHeight: scrollContainer.scrollHeight, clientHeight: scrollContainer.clientHeight, scrollTop: scrollContainer.scrollTop };
  });
  console.log(info);
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/true_max.png' });
  await browser.close();
})();
