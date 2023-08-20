require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loginToTwitter = async (page) => {
  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', process.env.USERNAME);

  const nextSelector =
    "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-kemksi.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > div > div:nth-child(6) > div";
  await page.click(nextSelector);
  await sleep(1000);

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', process.env.PASSWORD);
  await page.click('div[data-testid="LoginForm_Login_Button"]');
  await sleep(1000);

  await Promise.all([page.waitForNavigation()]);
};

const checkLogin = async (page) => {
  const url = await page.url();
  if (url === "https://twitter.com/home") {
    console.log("logged in");
  } else {
    throw new Error("not logged in");
  }
};

const goToBookmarks = async (page) => {
  await page.goto("https://twitter.com/i/bookmarks");
};
const getTweetUrls = async (page) => {
  const tweetUrlSelector =
    "div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > div.css-1dbjc4n.r-18u37iz.r-1q142lx > a";
  await page.waitForSelector(tweetUrlSelector);
  const tweetUrls = new Set();

  let previousHeight = await page.evaluate("document.body.scrollHeight");
  let currentHeight;
  let sameHeightCount = 0;

  while (true) {
    for (let i = 0; i < 30; i++) {
      // Increased the number of steps to 30 to make scrolling faster
      // Scroll smoothly by breaking down the scroll into smaller steps
      await page.evaluate("window.scrollBy(0, window.innerHeight / 10)");
      await sleep(50); // Reduced sleep time to 50ms to make scrolling faster
    }

    currentHeight = await page.evaluate("document.body.scrollHeight");
    if (currentHeight === previousHeight) {
      sameHeightCount++;
      if (sameHeightCount >= 20) {
        break;
      }
    } else {
      sameHeightCount = 0;
    }
    previousHeight = currentHeight;

    const newTweetUrls = await page.$$eval(tweetUrlSelector, (links) =>
      links.map((link) => link.href)
    );
    newTweetUrls.forEach((url) => tweetUrls.add(url));
    fs.writeFileSync("tweets.txt", [...tweetUrls].join("\n"));
    console.log(`Total tweets: ${tweetUrls.size}`);
    console.log(`Tweets after scroll: ${newTweetUrls.length}`);
  }
  // Take screenshot and save it
  await page.screenshot({ path: "screenshot.png" });
};
(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Change to false if you want to see the browser window
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Prevent loading images or videos
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.resourceType() === "image" || req.resourceType() === "media") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto("https://twitter.com/i/flow/login");

  await loginToTwitter(page);
  await checkLogin(page);
  await goToBookmarks(page);
  await getTweetUrls(page);

  await browser.close();
})();
