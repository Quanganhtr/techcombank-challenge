# BRAND-EXTRACTION.md
## Extract Techcombank brand kit via DevTools inspection

> Two methods below — use Snippets for scripts, Computed tab for manual inspection.
> Paste all findings into the **Extraction Results** section at the bottom.
> Then upload this file to Claude to update DESIGN-SYSTEM.md.

---

## Method A — Snippets (Recommended for scripts)

Snippets run code from DevTools' own editor — no paste warning, no security risk.

1. Open Chrome → go to `https://techcombank.com.vn`
2. Wait for full page load, scroll down once so lazy sections load
3. Open DevTools: `Cmd+Option+I` (Mac) or `F12` (Windows)
4. Click **Sources** tab → find **Snippets** in the left panel (may be hidden behind `>>`)
5. Click **+ New snippet** → name it (e.g. `tcb-colors`)
6. Paste the script into the editor on the right
7. Press `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows) to run
8. Switch to **Console** tab to see the output
9. Copy the output and paste into Extraction Results below

---

## Method B — Computed Tab (No code, manual inspection)

For inspecting individual elements directly — slower but zero setup.

1. Right-click any element on the page → **Inspect**
2. In the DevTools panel, click the **Computed** tab (next to Styles)
3. You'll see all final resolved CSS values for that element
4. Key things to look at:
   - `color` — exact text color
   - `background-color` — exact background
   - `font-family`, `font-size`, `font-weight` — typography
   - `border-radius` — corner radius
   - `padding`, `margin` — spacing
   - `box-shadow` — elevation

Use this on: primary buttons, cards, nav bar, headings, body text, input fields.

---

## Scripts (run via Snippets)

### Script 1 — CSS Custom Properties

> Finds any `--variable: value` the site defines. If TCB has a token system, this gets everything at once.

(() => {
  var vars = [];
  for (var i = 0; i < document.styleSheets.length; i++) {
    var sheet = document.styleSheets[i];
    try {
      for (var j = 0; j < sheet.cssRules.length; j++) {
        var rule = sheet.cssRules[j];
        if (rule.style) {
          for (var k = 0; k < rule.style.length; k++) {
            var prop = rule.style[k];
            if (prop.indexOf('--') === 0) {
              vars.push(prop + ': ' + rule.style.getPropertyValue(prop).trim());
            }
          }
        }
      }
    } catch (e) {}
  }
  var unique = [];
  var seen = {};
  for (var n = 0; n < vars.length; n++) {
    if (!seen[vars[n]]) {
      seen[vars[n]] = true;
      unique.push(vars[n]);
    }
  }
  unique.sort();
  console.log(unique.length ? unique.join('\n') : 'No CSS variables found');
})();

---

### Script 2 — Colors (deduplicated, sorted by frequency)

> Scans every element for background, text, and border colors. Converts rgb() to hex.

(() => {
  function toHex(rgb) {
    var m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return null;
    var r = parseInt(m[0]);
    var g = parseInt(m[1]);
    var b = parseInt(m[2]);
    var a = m[3] !== undefined ? parseInt(m[3]) : 1;
    if (a === 0) return null;
    var hr = r.toString(16).padStart(2, '0');
    var hg = g.toString(16).padStart(2, '0');
    var hb = b.toString(16).padStart(2, '0');
    return '#' + (hr + hg + hb).toUpperCase();
  }

  var props = ['color', 'backgroundColor', 'borderTopColor'];
  var colorMap = {};

  document.querySelectorAll('*').forEach(function(el) {
    var s = window.getComputedStyle(el);
    var tag = el.tagName.toLowerCase();
    var cls = (el.className && typeof el.className === 'string')
      ? el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    var label = cls ? tag + '.' + cls : tag;

    props.forEach(function(prop) {
      var hex = toHex(s[prop]);
      if (!hex) return;
      if (!colorMap[hex]) colorMap[hex] = [];
      if (colorMap[hex].indexOf(prop + ' on <' + label + '>') === -1) {
        colorMap[hex].push(prop + ' on <' + label + '>');
      }
    });
  });

  var sorted = Object.keys(colorMap).sort(function(a, b) {
    return colorMap[b].length - colorMap[a].length;
  });

  console.log('=== COLORS (sorted by frequency) ===');
  sorted.forEach(function(hex) {
    var usages = colorMap[hex].slice(0, 3).join(' | ');
    console.log(hex + '  --  ' + usages);
  });
})();

---

### Script 3 — Typography

> Reads computed font styles from key semantic elements.

(function() {
  var targets = [
    'h1', 'h2', 'h3', 'p', 'a', 'button', 'input', 'label',
    '[class*="title"]', '[class*="heading"]',
    '[class*="btn"]', '[class*="amount"]', '[class*="price"]'
  ];

  var seen = {};
  targets.forEach(function(sel) {
    var els;
    try { els = document.querySelectorAll(sel); } catch(e) { return; }
    els.forEach(function(el) {
      if (!el.innerText || !el.innerText.trim()) return;
      var s = window.getComputedStyle(el);
      var key = s.fontFamily + '|' + s.fontSize + '|' + s.fontWeight;
      if (seen[key]) return;
      seen[key] = true;
      console.log(
        sel + '\n' +
        '  font:   ' + s.fontFamily.split(',')[0].replace(/['"]/g, '').trim() + '\n' +
        '  size:   ' + s.fontSize + '  weight: ' + s.fontWeight + '  lh: ' + s.lineHeight + '\n' +
        '  color:  ' + s.color + '\n' +
        '  sample: "' + el.innerText.trim().slice(0, 50) + '"\n'
      );
    });
  });
}());

---

### Script 4 — Spacing & Border Radius

(function() {
  var targets = [
    'button', '[class*="btn"]', '[class*="card"]',
    'input', 'nav', 'header', '[class*="container"]'
  ];

  var seen = {};
  targets.forEach(function(sel) {
    var els;
    try { els = document.querySelectorAll(sel); } catch(e) { return; }
    els.forEach(function(el) {
      var s = window.getComputedStyle(el);
      var key = s.borderRadius + '|' + s.paddingTop + '|' + s.paddingLeft;
      if (seen[key]) return;
      seen[key] = true;
      var cls = typeof el.className === 'string'
        ? el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : '';
      var label = el.tagName.toLowerCase() + (cls ? '.' + cls : '');
      console.log(
        '<' + label + '>\n' +
        '  border-radius: ' + s.borderRadius + '\n' +
        '  padding:       ' + s.paddingTop + ' ' + s.paddingRight + ' ' + s.paddingBottom + ' ' + s.paddingLeft + '\n' +
        '  height:        ' + s.height + '\n'
      );
    });
  });
}());

---

### Script 5 — Shadows & Gradients

(function() {
  var shadows = {};
  var gradients = {};

  document.querySelectorAll('*').forEach(function(el) {
    var s = window.getComputedStyle(el);
    var cls = typeof el.className === 'string'
      ? el.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    var label = '<' + el.tagName.toLowerCase() + (cls ? '.' + cls : '') + '>';

    if (s.boxShadow && s.boxShadow !== 'none') {
      if (!shadows[s.boxShadow]) shadows[s.boxShadow] = [];
      shadows[s.boxShadow].push(label);
    }
    if (s.backgroundImage && s.backgroundImage.indexOf('gradient') !== -1) {
      if (!gradients[s.backgroundImage]) gradients[s.backgroundImage] = [];
      gradients[s.backgroundImage].push(label);
    }
  });

  console.log('=== SHADOWS ===');
  var shadowKeys = Object.keys(shadows);
  if (shadowKeys.length) {
    shadowKeys.forEach(function(v) {
      console.log(v + '\n  on: ' + shadows[v].slice(0, 3).join(', ') + '\n');
    });
  } else {
    console.log('none found');
  }

  console.log('=== GRADIENTS ===');
  var gradientKeys = Object.keys(gradients);
  if (gradientKeys.length) {
    gradientKeys.forEach(function(v) {
      console.log(v + '\n  on: ' + gradients[v].slice(0, 3).join(', ') + '\n');
    });
  } else {
    console.log('none found');
  }
}());

---

### Script 6 — Icon System Detector

(function() {
  var svgs = document.querySelectorAll('svg');
  console.log('Inline SVGs: ' + svgs.length);
  if (svgs.length) {
    console.log('  Sample viewBox: ' + svgs[0].getAttribute('viewBox'));
    console.log('  Sample class:   ' + (svgs[0].className && svgs[0].className.baseVal ? svgs[0].className.baseVal : '—'));
  }

  var allClasses = [];
  document.querySelectorAll('*').forEach(function(el) {
    if (typeof el.className === 'string') {
      el.className.split(' ').forEach(function(c) { allClasses.push(c); });
    }
  });

  var prefixes = ['fa', 'fas', 'far', 'material-icons', 'material-symbols', 'ti', 'bi', 'icon-'];
  prefixes.forEach(function(prefix) {
    var found = allClasses.filter(function(c) { return c.indexOf(prefix) === 0; });
    if (found.length) {
      console.log('Icon font: "' + prefix + '" — e.g. ' + found.slice(0, 3).join(', '));
    }
  });

  var iconImgs = Array.prototype.filter.call(
    document.querySelectorAll('img'),
    function(img) { return img.width < 40 || img.src.indexOf('icon') !== -1; }
  );
  console.log('\nSmall/icon <img>: ' + iconImgs.length);
  iconImgs.slice(0, 3).forEach(function(img) { console.log('  ' + img.src); });
}());

---

## Extraction Results

> Paste script outputs below, then upload this file to Claude.

### Script 1 — CSS Variables:
--accent: #ed1c24
--adjusted-full-width: calc(100%/(1 - var(--gutter)*2))
--background-magenta: #f5f6f8
--bg-button-added: #e0f7e5
--bg-icon: #f2ece0
--body: #000
--border-color: #404040
--col-grid: 4
--color-beige-light: #e9e2d5
--color-button-added: #1d6d30
--content-spacing: 0.5rem
--contentbody-fontweight: 300
--contentbody-line-height: 24px
--contentbody: 16px
--contentfootnote-line-height: 24px
--contentfootnote: 16px
--contenttitle-line-height: 24px
--contenttitle: 16px
--cta-disabled: #d9d9d9
--cta-secondary: #404040
--cyan-blue: #0a84ff
--dark-gray: #e3e4e6
--default-line-height: 24px
--default: 16px
--display-line-height-mobile: 60px
--display-line-height: 84px
--display-mobile: 40px
--display: 56px
--gray-600: #616161
--gray-900: #212121
--green: #32c959
--gutter: 0.044444444444
--header-height: 0px
--heading1-font-size: 32px
--heading1-font-weight: 300
--heading1-line-height: 40px
--heading2-font-size: 28px
--heading2-font-weight: 300
--heading2-line-height: 125%
--heading3-font-size: 24px
--heading3-font-weight: 600
--heading3-line-height: 36px
--heading4-font-size: 24px
--heading4-font-weight: 300
--heading4-line-height: 36px
--highlight: 18px
--hightlight-line-height: 27px
--icon-color: #1e1e1e
--light-background-hover: #dedede
--light-border: #dedede
--light-secondary-text: #616161
--main-color: #f2e1bc
--minus-space-margin: calc(-100%*var(--gutter)/(1 - var(--gutter)*2))
--mobile-heading1-font-size: 32px
--mobile-heading1-font-weight: 300
--mobile-heading1-line-height: 40px
--mobile-heading2-font-size: 28px
--mobile-heading2-font-weight: 300
--mobile-heading2-line-height: 35px
--mobile-heading3-font-size: 24px
--mobile-heading3-font-weight: 300
--mobile-heading3-line-height: 36px
--mobile-heading4-font-size: 24px
--mobile-heading4-font-weight: 300
--mobile-heading4-line-height: 36px
--negativePX: -24px
--note-line-height: 14px
--note: 14px
--padding-container: 0 4.4444444444vw
--padding-left-container-hub-page: -4.4444444444vw
--padding-left-container: 4.4444444444vw
--pink-red: #ed1c24
--primary-background: #fff
--primary-black: #000
--primary-color-gray-500: #e3e4e5
--primary-gold: #d6b973
--primary-ivory: #f1efe9
--primary-navy-blue: #1b1564
--primary-red: #ed1b24
--primary-sky-grey: #d6ebec
--primary-white: #fff
--priority-text: #ecd7b0
--secondary-gold: #ecd7b0
--secondary-gray: #404040
--secondary-grey-100: #212121
--secondary-grey-50: #5a5a5a
--secondary-grey-60: #616161
--secondary-grey-70: #313131
--secondary-grey-80: #333
--secondary-grey: #1c2629
--secondary-light-grey-100: #e3e4e6
--secondary-light-grey-60: #f5f5f5
--secondary-light-grey-80: #f2f2f2
--secondary-light-grey-90: #f1f1f1
--secondary-mid-grey-100: #a2a2a2
--secondary-mid-grey-40: #f5f6f8
--secondary-mid-grey-60: #dedede
--secondary-mid-grey-80: #c5c5c5
--space-margin: calc(100%*var(--gutter)/(1 - var(--gutter)*2))
--stats-line-height: 60px
--stats: 40px
--subheader-line-height: 18px
--subheader: 12px
--subnote-line-height: 21px
--subnote: 14px
--subtitle-line-height: 25px
--subtitle: 20px
--swiper-theme-color: #007aff
--table-default-line-height: 21px
--table-default: 14px
--table-header-line-height: 18px
--table-header: 12px
--text-hero-line-height: 60px
--text-hero: 40px
--tw-ring-offset-shadow: 0 0 #0000
--tw-ring-shadow: 0 0 #0000
--tw-rotate: 0
--tw-scale-x: 1
--tw-scale-y: 1
--tw-shadow: 0px 0px 8px 0px rgba(0,0,0,.32)
--tw-skew-x: 0
--tw-skew-y: 0
--tw-translate-x: 5px
--tw-translate-y: 0
--typeinlinelink-line-height: 24px
--typeinlinelink: 16px
--wtypecaptionsmall-letter-spacing: 2px
--wtypecaptionsmall-line-height: 21px
--wtypecaptionsmall: 14px

### Script 2 — Colors:
=== COLORS (sorted by frequency) ===

#000000  --  color on <html> | borderTopColor on <html> | color on <script>

#FFFFFF  --  backgroundColor on <div.header.aem-GridColumn> | backgroundColor on <ul.header_list_dropdown> | backgroundColor on <li.dropdown-item>

#A2A2A2  --  color on <ul.header_list_dropdown> | borderTopColor on <ul.header_list_dropdown> | color on <li.dropdown-item>

#616161  --  color on <span.dropdown_holder> | borderTopColor on <span.dropdown_holder> | color on <span.dropdown-arrow.material-symbols-outlined>

#ED1C24  --  color on <li.dropdown-item.active> | borderTopColor on <li.dropdown-item.active> | color on <a>

#444746  --  color on <input.gsc-input> | borderTopColor on <input.gsc-input> | color on <div.gsst_b>

#F5F6F8  --  backgroundColor on <html> | backgroundColor on <body.business-banking-template> | backgroundColor on <div.header_layout>

#DEDEDE  --  borderTopColor on <table.gstl_50.gssb_c> | borderTopColor on <tbody> | borderTopColor on <table.gstl_51.gssb_c>

#AAAAAA  --  color on <span.navigation_sub_item-des> | borderTopColor on <span.navigation_sub_item-des>

#1E1E1E  --  color on <span.global-sticky-banner__title> | borderTopColor on <span.global-sticky-banner__title>

#0A84FF  --  color on <a.global-sticky-banner__cta> | borderTopColor on <a.global-sticky-banner__cta>

#C4C4C4  --  backgroundColor on <span>

#D2D2D2  --  borderTopColor on <div.gsc-input-box>

#4D90FE  --  backgroundColor on <button.gsc-search-button.gsc-search-button-v2>

#3079ED  --  borderTopColor on <button.gsc-search-button.gsc-search-button-v2>

#F2F2F2  --  borderTopColor on <div.mobile-button>

#E3E4E6  --  borderTopColor on <li.dropdown-item>

#EBEEF2  --  backgroundColor on <div.tcb-bgColor>

#D9D9D9  --  backgroundColor on <div.scroll-to-top__icon>

#212121  --  backgroundColor on <footer.footer-container>

#333333  --  borderTopColor on <div.footer-info>

### Script 3 — Typography:
### Script 3 — Typography:
h1
font:   SF Pro Display
size:   32px  weight: 300  lh: 40px
color:  rgb(0, 0, 0)
sample: "Giải pháp và dịch vụ ngân hàng giúp chủ hộ kinh do"

h2
font:   SF Pro Display
size:   28px  weight: 300  lh: 35px
color:  rgb(0, 0, 0)
sample: "Sản phẩm nổi bật dành cho buôn bán, kinh doanh"

h3
font:   SF Pro Display
size:   24px  weight: 300  lh: 36px
color:  rgb(0, 0, 0)
sample: "Ứng vốn kinh doanh ShopCash"

h3
font:   SF Pro Display
size:   16px  weight: 700  lh: 24px
color:  rgb(0, 0, 0)
sample: "SoftPOS - Giải pháp nhận thanh toán thẻ tiện lợi"

h3
font:   SF Pro Display
size:   24px  weight: 600  lh: 36px
color:  rgb(255, 255, 255)
sample: "Dịch vụ khách hàng cá nhân"

p
font:   SF Pro Display
size:   20px  weight: 300  lh: 30px
color:  rgb(97, 97, 97)
sample: "Tài khoản Hộ Kinh doanh trên ngân hàng số Techcomb"

p
font:   SF Pro Display
size:   16px  weight: 400  lh: 24px
color:  rgb(0, 0, 0)
sample: "Quỹ dự phòng cho cửa hàng với hạn mức cấp sẵn đến"

p
font:   SF Pro Display
size:   16px  weight: 600  lh: 24px
color:  rgb(0, 0, 0)
sample: "Khám phá ngay"

p
font:   SF Pro Display
size:   14px  weight: 400  lh: 21px
color:  rgb(162, 162, 162)
sample: "Bản quyền © 2025 thuộc về Ngân hàng Thương mại cổ"

a
font:   SF Pro Display
size:   14px  weight: 600  lh: 21px
color:  rgb(162, 162, 162)
sample: "Cá nhân"

a
font:   SF Pro Display
size:   14px  weight: 500  lh: 21px
color:  rgb(10, 132, 255)
sample: "Đăng ký ngay"

button
font:   SF Pro Display
size:   0px  weight: 400  lh: 24px
color:  rgb(0, 0, 0)
sample: "tìm kiếm"

### Script 4 — Spacing & Border Radius:
<button.gsc-search-button.gsc-search-button-v2>
border-radius: 0px 8px 8px 0px
padding:       11px 10px 11px 10px
height:        auto

<button.cancel>
border-radius: 8px
padding:       16px 24px 16px 24px
height:        auto

<a.search-primary-btn>
border-radius: 0px
padding:       0px 0px 0px 0px
height:        24px

<div.card-label>
border-radius: 0px 0px 8px 8px
padding:       12px 16px 12px 16px
height:        auto

<div.list-card-info__item.img-large-image>
border-radius: 8px
padding:       0px 0px 0px 0px
height:        647.812px

<div.list-card-info__item-content>
border-radius: 0px
padding:       24px 24px 24px 24px
height:        520px

<nav.hero-breadcrumb-container.tcb-container>
border-radius: 0px
padding:       16px 0px 16px 0px
height:        56px

<div.popup__container-item>
border-radius: 12px
padding:       0px 0px 0px 0px
height:        auto

<div.search-primary-container>
border-radius: 16px
padding:       16px 16px 16px 16px
height:        auto

<footer.footer-container>
border-radius: 0px
padding:       32px 0px 32px 0px
height:        287px

<div.footer-links__social-container>
border-radius: 0px
padding:       8px 0px 12px 0px
height:        80px

### Script 5 — Shadows & Gradients:
=== SHADOWS ===

rgba(0, 0, 0, 0.1) 0px 5px 20px 0px

on: <div.header-navigation>, <div.navigation_secondary>
rgba(0, 0, 0, 0.06) 2px 4px 4px 0px

on: <ul.header_list_dropdown>, <ul.language_dropdown>, <div.header_list_dropdown>
rgba(0, 0, 0, 0.04) 0px 33px 181px 0px, rgba(0, 0, 0, 0.027) 0px 13.7866px 75.6175px 0px, rgba(0, 0, 0, 0.024) 0px 7.37098px 40.4287px 0px, rgba(0, 0, 0, 0.02) 0px 4.13211px 22.664px 0px, rgba(0, 0, 0, 0.016) 0px 2.19453px 12.0367px 0px, rgba(0, 0, 0, 0.01) 0px 0.913195px 5.00873px 0px

on: <div.login__drop-down>
rgba(0, 0, 0, 0.1) 0px 8px 16px 0px

on: <div.tab_item>
rgba(0, 0, 0, 0.12) -2px -2px 20px 0px

on: <div.recommend-pre-page-popup.hidden>
rgba(0, 0, 0, 0.16) 0px 3px 6px 0px, rgba(0, 0, 0, 0.23) 0px 3px 6px 0px

on: <div.tcb-download-app-block.revert-on-mobile>
rgba(0, 0, 0, 0.16) 0px 1px 4px 0px

on: <div.list-card-info__item.img-large-image>
rgba(0, 0, 0, 0.15) 0px 2px 8px 0px

on: <div.list-event-tile__item>
rgba(0, 0, 0, 0.15) 0px 0px 8px 0px

on: <img.global-sticky-banner__icon-image>
rgba(0, 0, 0, 0.2) 0px 11.008px 15.008px -7.008px, rgba(0, 0, 0, 0.14) 0px 24px 38px 3.008px, rgba(0, 0, 0, 0.12) 0px 9.008px 46px 8px

on: <div.global-sticky-banner-dialog__wrapper>
rgba(0, 0, 0, 0.08) 1px 1px 6px 0px

on: <table.gstl_50.gssb_c>
=== GRADIENTS ===

linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 255, 255) 1%, rgba(255, 255, 255, 0))

on: <div.tcb-hero-banner_control.tcb-hero-banner_control--prev>
linear-gradient(90deg, rgba(255, 255, 255, 0) 10%, rgb(255, 255, 255))

on: <div.tcb-hero-banner_control.tcb-hero-banner_control--next>

### Script 6 — Icons:
Inline SVGs: 5

Sample viewBox: 0 0 13 13

Sample class:   —
Icon font: "material-symbols" — e.g. material-symbols-outlined

Icon font: "icon-" — e.g. icon-svg
Small/icon <img>: 86

https://techcombank.com/etc.clientlibs/techcombank/clientlibs/clientlib-site/resources/images/search-primary-icon.svg

https://techcombank.com/content/dam/techcombank/public-site/seo/techcombank_logo_svg_86201e50d1.svg

https://techcombank.com/etc.clientlibs/techcombank/clientlibs/clientlib-site/resources/images/white-arrow-icon.svg

### Computed Tab — Manual observations:
| Element | Property | Value |
|---------|----------|-------|
| Primary button | background-color | |
| Primary button | border-radius | |
| Primary button | font-family | |
| Body text | font-family | |
| Body text | color | |
| Card | background-color | |
| Card | border-radius | |
| Card | box-shadow | |
| Nav bar | background-color | |
| Nav bar | height | |