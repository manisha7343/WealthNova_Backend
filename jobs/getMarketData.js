const cron = require('node-cron');
const Market = require('../model/market');

const marketSeedList = [
  // MAJOR INDICES (8 items as shown in screenshot)
  { symbol: "INDIAVIX", name: "INDIA VIX", price: 12.84, change: -0.45, percentChange: -3.38, category: "INDEX", exchange: "NSE" },
  { symbol: "NIFTY50", name: "NIFTY 50", price: 24574.15, change: 124.60, percentChange: 1.20, category: "INDEX", exchange: "NSE" },
  { symbol: "NIFTYIT", name: "NIFTY IT", price: 37200.00, change: 840.50, percentChange: 2.40, category: "INDEX", exchange: "NSE" },
  { symbol: "SENSEX", name: "SENSEX", price: 80742.35, change: 412.30, percentChange: 1.10, category: "INDEX", exchange: "BSE" },
  { symbol: "SILVER", name: "SILVER (MCX)", price: 91000.00, change: -240.00, percentChange: -0.26, category: "COMMODITY", exchange: "MCX" },
  { symbol: "USDINR", name: "USD / INR", price: 83.50, change: 0.08, percentChange: 0.10, category: "FOREX", exchange: "FOREX" },
  { symbol: "BANKNIFTY", name: "BANK NIFTY", price: 52847.65, change: -185.40, percentChange: -0.50, category: "INDEX", exchange: "NSE" },
  { symbol: "GOLD", name: "GOLD (MCX)", price: 76512.00, change: 350.00, percentChange: 0.46, category: "COMMODITY", exchange: "MCX" },

  // STOCK GAINERS (From Screenshot 1)
  { symbol: "ADTYFRG", name: "Aditya Forge Limited", price: 34.60, change: 31.50, percentChange: 1012.54, category: "GAINER", exchange: "BSE", volume: 5400000, desc: "Forging Components" },
  { symbol: "BRIJLEAS", name: "Brijlaxmi Leasing & Finance Ltd.", price: 10.20, change: 1.70, percentChange: 20.00, category: "GAINER", exchange: "BSE", volume: 3200000, desc: "Financial Services" },
  { symbol: "SMLT", name: "Sarthak Metals Ltd", price: 74.18, change: 12.35, percentChange: 19.99, category: "GAINER", exchange: "NSE", volume: 4800000, desc: "Industrial Metals" },
  { symbol: "KALPACOMME", name: "Kalpa Commercial Ltd", price: 8.99, change: 1.49, percentChange: 19.87, category: "GAINER", exchange: "BSE", volume: 2100000, desc: "Trading & Distribution" },
  { symbol: "ASSOCIATED", name: "Associated Coaters Limited", price: 109.95, change: 15.95, percentChange: 16.97, category: "GAINER", exchange: "BSE", volume: 1600000, desc: "Industrial Coatings" },
  { symbol: "XELPMOC", name: "Xelpmoc Design And Tech Ltd", price: 93.67, change: 13.43, percentChange: 16.74, category: "GAINER", exchange: "NSE", volume: 6200000, desc: "Tech & Consulting" },

  // STOCK LOSERS (From Screenshot 1)
  { symbol: "KMSUGAR", name: "K.M. Sugar Mills Ltd.", price: 27.74, change: -5.94, percentChange: -17.64, category: "LOSER", exchange: "NSE", volume: 2900000, desc: "Sugar Production" },
  { symbol: "ASTRONMULT", name: "Astron Multigrain Limited", price: 14.32, change: -3.03, percentChange: -17.46, category: "LOSER", exchange: "BSE", volume: 1800000, desc: "Food Processing" },
  { symbol: "JUSTO", name: "Justo Realfintech Limited", price: 76.20, change: -12.83, percentChange: -14.41, category: "LOSER", exchange: "BSE", volume: 1400000, desc: "Fintech & Realty" },
  { symbol: "FWSTC", name: "Flywings Simulator Training Centre Limited", price: 197.65, change: -28.98, percentChange: -12.81, category: "LOSER", exchange: "BSE", volume: 950000, desc: "Aviation Training" },
  { symbol: "IDEALTECHO", name: "Ideal Technoplast Industries Limited", price: 85.60, change: -12.05, percentChange: -12.34, category: "LOSER", exchange: "BSE", volume: 1100000, desc: "Plastics & Packaging" },
  { symbol: "BALGOPAL", name: "Balgopal Commercial Ltd.", price: 160.05, change: -21.55, percentChange: -11.89, category: "LOSER", exchange: "BSE", volume: 820000, desc: "Commercial Trading" },

  // HIGH VOLUME & BLUE CHIP ACTIVE STOCKS
  { symbol: "SBIN", name: "State Bank of India", price: 750.00, change: -1.50, percentChange: -0.20, category: "LOSER", exchange: "NSE", volume: 25400000, desc: "Public Sector Banking" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1450.00, change: -11.70, percentChange: -0.80, category: "LOSER", exchange: "NSE", volume: 18200000, desc: "Private Sector Banking" },
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", price: 2950.00, change: 43.60, percentChange: 1.50, category: "GAINER", exchange: "NSE", volume: 15800000, desc: "Energy & Conglomerate" },
  { symbol: "ITC", name: "ITC Ltd", price: 410.00, change: -1.65, percentChange: -0.40, category: "LOSER", exchange: "NSE", volume: 14300000, desc: "FMCG & Diversified" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", price: 1080.00, change: 22.25, percentChange: 2.10, category: "GAINER", exchange: "NSE", volume: 12500000, desc: "Private Banking" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 920.00, change: -5.40, percentChange: -0.58, category: "LOSER", exchange: "NSE", volume: 11100000, desc: "Automotive" },
  { symbol: "INFY", name: "Infosys Ltd", price: 1650.00, change: 18.00, percentChange: 1.10, category: "GAINER", exchange: "NSE", volume: 8200000, desc: "IT Services" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4100.00, change: 36.50, percentChange: 0.90, category: "GAINER", exchange: "NSE", volume: 5300000, desc: "IT Consulting" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", price: 1150.00, change: 8.00, percentChange: 0.70, category: "GAINER", exchange: "NSE", volume: 4100000, desc: "Telecommunications" },
  { symbol: "LT", name: "Larsen & Toubro Ltd", price: 3450.00, change: -24.00, percentChange: -0.69, category: "LOSER", exchange: "NSE", volume: 3700000, desc: "Engineering & Infrastructure" }
];

const fetchAndDumpMarketData = async () => {
  try {
    console.log("Syncing market data in DB...");
    for (let item of marketSeedList) {
      await Market.findOneAndUpdate(
        { symbol: item.symbol },
        { ...item, lastUpdated: new Date() },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log("Market data synced successfully in DB!");
  } catch (error) {
    console.error("Market data sync error:", error.message);
  }
};

module.exports = fetchAndDumpMarketData;