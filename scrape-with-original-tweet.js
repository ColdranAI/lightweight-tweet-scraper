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
  
  const extractTweetId = (article) => {
    // Method 1: Try to find a link with tweet ID pattern
    const tweetLink = article.querySelector('a[href*="/status/"]');
    if (tweetLink) {
      const href = tweetLink.getAttribute('href');
      const match = href.match(/\/status\/(\d+)/);
      if (match) return match[1];
    }
    
    // Method 2: Try to find time element with datetime attribute
    const timeEl = article.querySelector('time');
    if (timeEl) {
      const nearestLink = timeEl.closest('a') || timeEl.parentElement?.querySelector('a');
      if (nearestLink) {
        const href = nearestLink.getAttribute('href');
        const match = href?.match(/\/status\/(\d+)/);
        if (match) return match[1];
      }
    }
    
    // Method 3: Search all links in the article for status pattern
    const allLinks = article.querySelectorAll('a[href]');
    for (const link of allLinks) {
      const href = link.getAttribute('href');
      const match = href?.match(/\/status\/(\d+)/);
      if (match) return match[1];
    }
    
    return null;
  };
  
  const extractUsername = (article) => {
    // Method 1: Try to extract from any link that contains a username pattern
    const links = article.querySelectorAll('a[href]');
    for (const link of links) {
      const href = link.getAttribute('href');
      // Look for pattern like /username or /username/status/...
      const match = href?.match(/^\/([^\/]+)(?:\/|$)/);
      if (match && match[1] && !match[1].includes('status') && !match[1].includes('search') && !match[1].includes('home')) {
        return match[1];
      }
    }
    
    // Method 2: Look for elements that might contain @username
    const spanElements = article.querySelectorAll('span');
    for (const span of spanElements) {
      const text = span.innerText?.trim();
      if (text && text.startsWith('@')) {
        return text.substring(1); // Remove @ symbol
      }
    }
    
    // Method 3: Try to find username in data attributes or other patterns
    const userLinks = article.querySelectorAll('a[href*="/"]');
    for (const link of userLinks) {
      const href = link.getAttribute('href');
      if (href?.startsWith('/') && !href.includes('/status/') && !href.includes('/search') && !href.includes('/home')) {
        const username = href.substring(1).split('/')[0];
        if (username && username.length > 0 && !username.includes('?')) {
          return username;
        }
      }
    }
    
    return null;
  };
  
  const extractDisplayName = (article) => {
    // Try to find the display name (full name)
    const nameSelectors = [
      'div[dir="ltr"] > span',
      'a[role="link"] span',
      'div[data-testid="User-Name"] span'
    ];
    
    for (const selector of nameSelectors) {
      const element = article.querySelector(selector);
      if (element && element.innerText?.trim()) {
        const text = element.innerText.trim();
        // Make sure it's not a username (doesn't start with @)
        if (!text.startsWith('@')) {
          return text;
        }
      }
    }
    
    return null;
  };
  
  const extractTweets = () => {
    const articles = document.querySelectorAll("article");
    articles.forEach((article) => {
      const textEl = article.querySelector('div[data-testid="tweetText"]');
      const statGroup = article.querySelector('div[role="group"]');
      
      if (!textEl || !statGroup) return;
      
      // Extract engagement stats
      let replies = null, reposts = null, likes = null, views = null;
      statGroup.querySelectorAll('[aria-label]').forEach((el) => {
        const label = el.getAttribute("aria-label")?.toLowerCase() || "";
        const value = label.match(/([\d.,Kk]+)/)?.[1]?.replace(/,/g, "") || null;
        if (label.includes("reply")) replies = value;
        else if (label.includes("repost")) reposts = value;
        else if (label.includes("like")) likes = value;
        else if (label.includes("view")) views = value;
      });
      
      // Extract basic info
      const text = textEl?.innerText?.trim();
      const username = extractUsername(article);
      const displayName = extractDisplayName(article);
      const tweetId = extractTweetId(article);
      
      // Create tweet URL if we have the ID and username
      let tweetUrl = null;
      if (tweetId && username) {
        tweetUrl = `https://x.com/${username}/status/${tweetId}`;
      }
      
      const id = `${username}::${text}`;
      
      if (text && username && !scraped.has(id)) {
        const tweetData = {
          username,
          displayName,
          text,
          replies,
          reposts,
          likes,
          views,
          tweetId,
          tweetUrl
        };
        
        window.currentChunk.push(tweetData);
        scraped.add(id);
        console.log(`[${window.currentChunk.length}] @${username} (${displayName}): ${text}`);
        if (tweetUrl) console.log(`   🔗 ${tweetUrl}`);
        
        if (window.currentChunk.length >= CHUNK_SIZE) saveChunk();
      }
    });
  };
  
  const observer = new MutationObserver(() => extractTweets());
  observer.observe(document.body, { childList: true, subtree: true });
  
  window.scrollInterval = setInterval(() => window.scrollBy(0, 1000), 1500);
  
  window.stopScroll = () => {
    clearInterval(window.scrollInterval);
    observer.disconnect(); // Stop observing when done
    
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
  
  console.log("🚀 Enhanced scraper started. Will auto-save every 100 tweets with tweet URLs!");
  console.log("📝 Each tweet now includes: username, displayName, text, engagement stats, tweetId, and tweetUrl");
  console.log("⏹️ Call window.stopScroll() to stop and save remaining tweets");
})();