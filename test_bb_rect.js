const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const sticky = document.querySelector('.sticky');
    const scrollContainer = sticky.closest('.overflow-y-auto');
    const stickyRect = sticky.getBoundingClientRect();
    // bottom bar wrapper is the next sibling after sticky wrapper
    const bottomBarWrapper = sticky.nextElementSibling;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    const bbRect = bottomBarWrapper.getBoundingClientRect();
    return {
      stickyHeight: stickyRect.height,
      bottomBarWrapperClass: bottomBarWrapper.className,
      bbRect,
      scrollContainerClientHeight: scrollContainer.clientHeight,
      scrollContainerScrollHeight: scrollContainer.scrollHeight,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
