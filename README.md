# tweet-scrape-scroll
Scrape Tweets while Scrolling




1. Go to Chrome 


2. Go to X.com


3. Open your Browser Console and Paste

```js
(() => {
  const scraped = new Set();
  const results = [];

  const extractTweets = () => {
    const articles = document.querySelectorAll("article");

    articles.forEach((article) => {
      const textEl = article.querySelector('div[data-testid="tweetText"]');
      const userEl = article.querySelector('div[dir="ltr"] > span');

      const statGroup = article.querySelector('div[role="group"]');
      if (!statGroup) return;

      let replies = null, reposts = null, likes = null, views = null;

      const statElements = statGroup.querySelectorAll('[aria-label]');
      statElements.forEach((el) => {
        const label = el.getAttribute("aria-label")?.toLowerCase() || "";
        const match = label.match(/([\d.,Kk]+)/);
        const value = match ? match[1].replace(/,/g, "") : null;

        if (label.includes("reply")) replies = value;
        else if (label.includes("repost")) reposts = value;
        else if (label.includes("like")) likes = value;
        else if (label.includes("view")) views = value;
      });

      const text = textEl?.innerText?.trim();
      const username = userEl?.innerText?.trim();

      if (text && username) {
        const id = `${username}::${text}`;
        if (!scraped.has(id)) {
          scraped.add(id);
          results.push({ username, text, replies, reposts, likes, views });
          console.log(`@${username} — 💬 ${replies} 🔁 ${reposts} ❤️ ${likes} 👁️ ${views}\n> ${text}`);
        }
      }
    });
  };

  extractTweets();

  const observer = new MutationObserver(() => {
    extractTweets();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("Scraper is live... just keep scrolling!");
  console.log("Use `downloadTweets()` to save as json.");

  window.downloadTweets = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tweets_with_stats.json";
    a.click();
    URL.revokeObjectURL(url);
  };
})();
```

Voila you're done, and as i'm sharing this

Most likely i'm banned from twitter or maybe just winning + freedom of speech is a joke and flawed with their own standards.

But again use this for educational purposes only and don't misuse this but one of my main reason to build this is to replicate a persona of my fav twitter creators and write tweets like them :3