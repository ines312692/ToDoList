process.env.CHROME_BIN = require('puppeteer').executablePath();
module.exports = function (config) {
  config.set({

    browsers: ['CustomChromeHeadless'],
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
  });
};
