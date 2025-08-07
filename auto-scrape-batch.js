(() => {
  window.currentChunk = [];
  const scraped = new Set();
  let chunk = 1;
  const CHUNK_SIZE = 100;

  const saveChunk = () => {
    const blob = new Blob([JSON.stringify(window.currentChunk, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tweets_${chunk++}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    console.log(`💾 Saved ${CHUNK_SIZE} tweets as tweets_${chunk - 1}.json`);
    window.currentChunk = []; // 🔥 delete them from memory!
  };

  const extractTweets = () => {
    const articles = document.querySelectorAll("article");
    articles.forEach((article) => {
      const textEl = article.querySelector('div[data-testid="tweetText"]');
      const userEl = article.querySelector('div[dir="ltr"] > span');
      const statGroup = article.querySelector('div[role="group"]');
      if (!textEl || !userEl || !statGroup) return;

      let replies = null, reposts = null, likes = null, views = null;
      statGroup.querySelectorAll('[aria-label]').forEach((el) => {
        const label = el.getAttribute("aria-label")?.toLowerCase() || "";
        const value = label.match(/([\d.,Kk]+)/)?.[1]?.replace(/,/g, "") || null;
        if (label.includes("reply")) replies = value;
        else if (label.includes("repost")) reposts = value;
        else if (label.includes("like")) likes = value;
        else if (label.includes("view")) views = value;
      });

      const text = textEl?.innerText?.trim();
      const username = userEl?.innerText?.trim();
      const id = `${username}::${text}`;
      if (text && username && !scraped.has(id)) {
        window.currentChunk.push({ username, text, replies, reposts, likes, views });
        scraped.add(id);
        console.log(`[${window.currentChunk.length}] @${username}: ${text}`);
        if (window.currentChunk.length >= CHUNK_SIZE) saveChunk();
      }
    });
  };

  const observer = new MutationObserver(() => extractTweets());
  observer.observe(document.body, { childList: true, subtree: true });

  window.scrollInterval = setInterval(() => window.scrollBy(0, 1000), 1500);

  window.stopScroll = () => {
    clearInterval(window.scrollInterval);
    if (window.currentChunk.length > 0) {
      const blob = new Blob([JSON.stringify(window.currentChunk, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `tweets_final_${window.currentChunk.length}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      console.log("🛑 Final partial chunk saved.");
    } else {
      console.log("🛑 Stopped. No tweets left to save.");
    }
  };

  console.log("🚀 Scraper started. Will auto-save every 100 tweets and flush memory each time.");
})();
