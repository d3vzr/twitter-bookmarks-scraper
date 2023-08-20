# Twitter Bookmark Scraper

This script is a Node.js application that uses Puppeteer to log into Twitter, navigate to the bookmarks page, and scrape the URLs of all bookmarked tweets. The URLs are then saved to a text file.

## Prerequisites

- Node.js
- Puppeteer (`npm install puppeteer`)
- dotenv (`npm install dotenv`)

## Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory of the project and add your Twitter username and password like so: 
```
USERNAME=your_twitter_username
PASSWORD=your_twitter_password
```
## Usage

Run the script with `node index.js`. The script will log into Twitter, navigate to the bookmarks page, and start scrolling to load all bookmarked tweets. The URLs of the tweets are saved to a file named `tweets.txt`. The script also takes a screenshot of the page and saves it as `screenshot.png`.

## Note

- The script is set to run in non-headless mode, meaning you will see the browser window while the script is running. If you want to run the script in headless mode, change the `headless` option to `true` in the Puppeteer launch options.
- The CSS selectors used in the script are subject to change as Twitter updates their website. If the script stops working, you may need to update the selectors.

## Disclaimer

This script is for educational purposes only. Always respect the terms of service of the website you are scraping.