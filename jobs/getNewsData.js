const News = require('../model/News');

// Manual News Data (Stored directly in your DB - NO external API)
const manualNewsData = [
  {
    title: "Reliance Industries announces strong Q3 results, beats market estimates",
    desc: "The conglomerate reported robust performance across all major business segments with strong retail and telecom expansion.",
    description: "The conglomerate reported robust performance across all major business segments with strong retail and telecom expansion.",
    source: "Moneycontrol",
    category: "Corporate",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    link: "https://www.moneycontrol.com",
    url: "https://www.moneycontrol.com",
    time: "2 hours ago",
    pubDate: "2 hours ago",
  },
  {
    title: "Indian tech sector rallies as AI adoption accelerates globally",
    desc: "Major IT companies see significant stock gains as AI integration and cloud transformation deals surge.",
    description: "Major IT companies see significant stock gains as AI integration and cloud transformation deals surge.",
    source: "Livemint",
    category: "Technology",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    link: "https://www.livemint.com",
    url: "https://www.livemint.com",
    time: "5 hours ago",
    pubDate: "5 hours ago",
  },
  {
    title: "RBI maintains repo rate at 6.5% in latest monetary policy meeting",
    desc: "Central bank keeps interest rates unchanged amid global economic uncertainty while maintaining growth projection.",
    description: "Central bank keeps interest rates unchanged amid global economic uncertainty while maintaining growth projection.",
    source: "Economic Times",
    category: "Policy",
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    link: "https://economictimes.indiatimes.com",
    url: "https://economictimes.indiatimes.com",
    time: "1 day ago",
    pubDate: "1 day ago",
  },
  {
    title: "HDFC Bank net profit rises 20% YoY in Q4, beats estimates",
    desc: "Private sector lender reports strong growth driven by retail banking advances and improved asset quality.",
    description: "Private sector lender reports strong growth driven by retail banking advances and improved asset quality.",
    source: "Bloomberg",
    category: "Banking",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    link: "https://www.bloomberg.com",
    url: "https://www.bloomberg.com",
    time: "1 day ago",
    pubDate: "1 day ago",
  },
  {
    title: "Federal Reserve hints at steady rates ahead of Q4",
    desc: "US central bank officials suggest holding the interest rates steady amidst cooling inflation data.",
    description: "US central bank officials suggest holding the interest rates steady amidst cooling inflation data.",
    source: "Reuters",
    category: "Global",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    link: "https://www.reuters.com",
    url: "https://www.reuters.com",
    time: "10 mins ago",
    pubDate: "10 mins ago",
  },
  {
    title: "Tech stocks rally in pre-market trading in NASDAQ",
    desc: "Major semiconductor companies see a 4% jump globally following strong earnings reports from Asia.",
    description: "Major semiconductor companies see a 4% jump globally following strong earnings reports from Asia.",
    source: "Bloomberg",
    category: "Global",
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    link: "https://www.bloomberg.com",
    url: "https://www.bloomberg.com",
    time: "1 hr ago",
    pubDate: "1 hr ago",
  },
  {
    title: "ECB prepares for a strategic pivot next month",
    desc: "European markets brace for a potential policy shift as economic growth shows signs of stabilization.",
    description: "European markets brace for a potential policy shift as economic growth shows signs of stabilization.",
    source: "Financial Times",
    category: "Global",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    link: "https://www.ft.com",
    url: "https://www.ft.com",
    time: "3 hrs ago",
    pubDate: "3 hrs ago",
  },
  {
    title: "Crude oil slips below $75 per barrel",
    desc: "Global oil prices trend downwards as non-OPEC supply increases counteract recent production cuts.",
    description: "Global oil prices trend downwards as non-OPEC supply increases counteract recent production cuts.",
    source: "CNBC",
    category: "Commodity",
    img: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&q=80",
    link: "https://www.cnbc.com",
    url: "https://www.cnbc.com",
    time: "5 hrs ago",
    pubDate: "5 hrs ago",
  },
];

// Pure DB Dump function (No external network API)
const dumpManualNews = async () => {
  try {
    console.log("Dumping manual news data into DB...");
    for (let item of manualNewsData) {
      await News.findOneAndUpdate(
        { title: item.title },
        { ...item, lastUpdated: new Date() },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log("Manual news dumped in DB successfully!");
  } catch (error) {
    console.error("News dump error:", error.message);
  }
};

module.exports = dumpManualNews;
