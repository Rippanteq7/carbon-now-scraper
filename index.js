const puppeteer = require("puppeteer");
const { options, themes, langs, fonts } = require("./options.js");

/**
 *
 * @param {String} code - a Program code for Carbon
 * @param {String} outputPath - Output File Name Path
 * @param {Object} option - a additional Argument Option for Carbon
 * @returns {String} outputPath
 */
async function carbon(code, outputPath, option = {}) {
  const {
    lang,
    background,
    theme,
    font,
    "window-controls": windowControls,
    "width-adjustment": widthAdjustment,
    line,
    "first-line": firstLine,
    watermark,
  } = { ...options, ...option };

  // Checking
  let msg = null
  if (typeof code === "undefined") msg = "Program Code argument cannot be empty!";
  if (!langs.includes(lang)) msg = `There is no ${lang} programming language, `;
    + `please check at carbon.now.sh for a list of programming languages`;
  if (!themes.includes(theme)) msg = `There is no ${theme} Carbon Themes, `;
    + `please check at carbon.now.sh for a list of Theme`;
  if (!fonts.includes(font)) msg = `There is no ${font} Carbon Fonts, `;
    + `please check at carbon.now.sh for a list of Fonts`;
  if (msg) throw new Error(msg)

  let fontParam = font.replace("-", " ");
  // Parameter Url
  let parameter = new URLSearchParams({
    code,
    l: lang,
    bg: background,
    t: theme,
    fm: fontParam,
    wc: windowControls,
    wa: widthAdjustment,
    ln: line,
    fl: firstLine,
    wm: watermark,
  });
  let url = "https://carbon.now.sh?" + parameter.toString();

  return openBrowser(url, outputPath, option.puppeteer);
}

/**
 *
 * @param {String} url - Url for Downloading
 * @param {String} outputPath - Output for File
 * @param {Object} optsPuppeteer - Options for puppeteer launch
 */
async function openBrowser(url, outputPath, optsPuppeteer = {}) {
  // Start Puppeteer Session
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
    ...optsPuppeteer,
  });

  try {
    // Open Page and Go to Carbon Site
    const page = await browser.newPage();
    await page.goto(url);
    // Make Downloaded file more HD
    await page.setViewport({
    	width: 1920,
        height: 1080,
        deviceScaleFactor: 2,
    });
    // Screenshot the element
    await page.waitForSelector("#export-container");
    const element = await page.$("#export-container");
    await element.screenshot({ path: outputPath });

    return outputPath;
  } catch (e) {
    throw new Error(e)
  } finally {
    // Close Browser
    await browser.close()
  }
}

module.exports = carbon;
