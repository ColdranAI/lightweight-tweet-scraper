# Scrape Tweets while Scrolling

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
    const message = `Downloaded ${results.length} tweets as tweets_with_stats.json`;
    console.log(message);
    return message;
  };

})();
```

Voila you're done

download via thia
```js
downloadTweets()
```


very random but this the graphql endpoint

<details>
  <summary>X Graphql Endpoint</summary>

```bash
https://x.com/i/api/graphql/0uQE4rvNofAr4pboHOZWVA/UserTweets?variables={
  "userId": "1654221044503408640",
  "count": 20,
  "includePromotedContent": true,
  "withQuickPromoteEligibilityTweetFields": true,
  "withVoice": true
}&features={
  "rweb_video_screen_enabled": false,
  "payments_enabled": false,
  "profile_label_improvements_pcf_label_in_post_enabled": true,
  "rweb_tipjar_consumption_enabled": true,
  "verified_phone_label_enabled": true,
  "creator_subscriptions_tweet_preview_api_enabled": true,
  "responsive_web_graphql_timeline_navigation_enabled": true,
  "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
  "premium_content_api_read_enabled": false,
  "communities_web_enable_tweet_community_results_fetch": true,
  "c9s_tweet_anatomy_moderator_badge_enabled": true,
  "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
  "responsive_web_grok_analyze_post_followups_enabled": true,
  "responsive_web_jetfuel_frame": true,
  "responsive_web_grok_share_attachment_enabled": true,
  "articles_preview_enabled": true,
  "responsive_web_edit_tweet_api_enabled": true,
  "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
  "view_counts_everywhere_api_enabled": true,
  "longform_notetweets_consumption_enabled": true,
  "responsive_web_twitter_article_tweet_consumption_enabled": true,
  "tweet_awards_web_tipping_enabled": false,
  "responsive_web_grok_show_grok_translated_post": false,
  "responsive_web_grok_analysis_button_from_backend": true,
  "creator_subscriptions_quote_tweet_preview_enabled": false,
  "freedom_of_speech_not_reach_fetch_enabled": true,
  "standardized_nudges_misinfo": true,
  "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
  "longform_notetweets_rich_text_read_enabled": true,
  "longform_notetweets_inline_media_enabled": true,
  "responsive_web_grok_image_annotation_enabled": true,
  "responsive_web_grok_community_note_auto_translation_is_enabled": false,
  "responsive_web_enhance_cards_enabled": false
}&fieldToggles={
  "withArticlePlainText": false
}
```

```bash
curl 'https://x.com/i/api/graphql/0uQE4rvNofAr4pboHOZWVA/UserTweets?variables=...' \
  -H 'authorization: Bearer AAAAAAAAAAAAAAAAANRegergerAAAAAnNwIzUejRCOuH5...' \
  -H 'x-csrf-token: <your ct0 token>' \
  -H 'cookie: auth_token=...; ct0=...' \
  -H 'x-twitter-auth-type: OAuth2Session' \
  -H 'x-twitter-active-user: yes'
```

</details>

you can do whatever the heck u want wit this info and pls use your web console it's love

alsooooo

Most likely i'm banned from twitter for this basic thing or maybe just winning + freedom of speech is a joke and flawed with their own standards.

But again use this for educational purposes only and don't misuse this but one of my main reason to build this is to replicate a persona of my fav twitter creators and write tweets like them :3

Wait are you lazy? You need Auto Scroll

### Auto Scroll with Batch Scraping

1. first step to start scraping
```js
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
```

2. Stop Scroll
```js
stopScroll();
```

this will download all the tweets saved




4. Cleanup (Reset Everything) ~ optional

```js
  delete window.currentChunk;
  delete window.scrollInterval;
  delete window.stopScroll;
```




## Want the original tweet and the username in the scrapper data 
> Try this 
```js

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
```