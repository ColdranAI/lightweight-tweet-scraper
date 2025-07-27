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

Voila you're done, and as i'm sharing this


very random but this the graphql endpoint

<details>
  <summary>X Graphql Endpoint</summary>

```bash
https://x.com/i/api/graphql/0uQE4rvNofAr4pboHOZWVA/UserTweets?variables={
  "userId": "1654347044503408640",
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
  -H 'authorization: Bearer AAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5...' \
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

  const observer = new MutationObserver(() => {
    extractTweets();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  let scrollInterval = setInterval(() => {
    window.scrollBy(0, 1000);
  }, 1000);

  window.stopScroll = () => {
    clearInterval(scrollInterval);
    const message = `Auto-scroll stopped. Total tweets scraped: ${results.length}`;
    console.log(message);
    return message;
  };

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

  console.log("🚀 Scraper is live... auto-scrolling enabled!");
  console.log("Run `stopScroll()` to stop scrolling.");
  console.log("Run `downloadTweets()` to save tweets as JSON.");
})();
```