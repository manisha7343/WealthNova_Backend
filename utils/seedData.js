const mongoose = require('mongoose');
require('dotenv').config();

const IPO = require('../model/IPO');
const News = require('../model/News');
const Market = require('../model/market');
const StockDetails = require('../model/stockDetails');
const Crypto = require('../model/Crypto');

const initialStocks = [
  {
    symbol: "RELIANCE",
    companyName: "Reliance Industries Ltd",
    shortName: "Reliance",
    nseSymbol: "RELIANCE",
    industry: "Oil & Gas / Telecom / Retail",
    sector: "Energy",
    description: "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai, with businesses across energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.",
    marketData: {
      currentPrice: 2950,
      marketCap: 1995800,
      peRatio: 28.4,
      bookValue: 1120,
      faceValue: 10,
      dividendYield: 0.35,
      high52Week: 3217,
      low52Week: 2220,
      eps: 103.8,
    },
    quarterlyResults: [
      { period: "Sep 2025", sales: 235000, expenses: 195000, operatingProfit: 40000, opm: 17, otherIncome: 3500, interest: 5500, depreciation: 12000, profitBeforeTax: 26000, taxPercentage: 25, netProfit: 19500, eps: 28.8 },
      { period: "Dec 2025", sales: 242000, expenses: 200000, operatingProfit: 42000, opm: 17.3, otherIncome: 3800, interest: 5600, depreciation: 12200, profitBeforeTax: 28000, taxPercentage: 25, netProfit: 21000, eps: 31.0 }
    ],
    profitLoss: [
      { period: "Mar 2024", sales: 890000, expenses: 740000, operatingProfit: 150000, opm: 16.8, otherIncome: 14000, interest: 21000, depreciation: 45000, profitBeforeTax: 98000, taxPercentage: 24, netProfit: 74500, eps: 110.2, dividendPayout: 10 },
      { period: "Mar 2025", sales: 960000, expenses: 790000, operatingProfit: 170000, opm: 17.7, otherIncome: 15000, interest: 22000, depreciation: 48000, profitBeforeTax: 115000, taxPercentage: 24, netProfit: 87400, eps: 129.2, dividendPayout: 10 }
    ],
    balanceSheet: [
      { period: "Mar 2025", equityCapital: 6765, reserves: 780000, borrowings: 310000, otherLiabilities: 380000, totalLiabilities: 1476765, fixedAssets: 780000, cwip: 145000, investments: 290000, otherAssets: 261765, totalAssets: 1476765 }
    ],
    ratios: [
      { period: "Mar 2025", debtorDays: 18, cashConversionCycle: 28, workingCapitalDays: 14, roce: 12.8 }
    ],
    growth: {
      profitGrowth: { tenYear: 14, fiveYear: 12, threeYear: 15, ttm: 17 },
      salesGrowth: { tenYear: 12, fiveYear: 11, threeYear: 14, ttm: 15 }
    },
    analysis: {
      pros: ["Company has good return on equity (ROE) track record", "Strong multi-sector leadership in retail and 5G telecom"],
      cons: ["High capital expenditure in green energy transitions"]
    }
  },
  {
    symbol: "INFY",
    companyName: "Infosys Ltd",
    shortName: "Infosys",
    nseSymbol: "INFY",
    industry: "Information Technology",
    sector: "IT Services",
    description: "Infosys Limited is an Indian multinational information technology company providing business consulting, information technology and outsourcing services.",
    marketData: {
      currentPrice: 1650,
      marketCap: 685000,
      peRatio: 26.5,
      bookValue: 210,
      faceValue: 5,
      dividendYield: 2.4,
      high52Week: 1990,
      low52Week: 1350,
      eps: 62.3,
    },
    quarterlyResults: [
      { period: "Sep 2025", sales: 39500, expenses: 29500, operatingProfit: 10000, opm: 25.3, otherIncome: 800, interest: 100, depreciation: 1200, profitBeforeTax: 9500, taxPercentage: 27, netProfit: 6935, eps: 16.7 },
      { period: "Dec 2025", sales: 40200, expenses: 30000, operatingProfit: 10200, opm: 25.4, otherIncome: 850, interest: 100, depreciation: 1250, profitBeforeTax: 9700, taxPercentage: 27, netProfit: 7081, eps: 17.1 }
    ],
    profitLoss: [
      { period: "Mar 2025", sales: 155000, expenses: 116000, operatingProfit: 39000, opm: 25.1, otherIncome: 3200, interest: 400, depreciation: 4800, profitBeforeTax: 37000, taxPercentage: 27, netProfit: 27010, eps: 65.2, dividendPayout: 60 }
    ],
    balanceSheet: [
      { period: "Mar 2025", equityCapital: 2075, reserves: 84000, borrowings: 0, otherLiabilities: 32000, totalLiabilities: 118075, fixedAssets: 28000, cwip: 1800, investments: 18000, otherAssets: 70275, totalAssets: 118075 }
    ],
    ratios: [
      { period: "Mar 2025", debtorDays: 62, cashConversionCycle: 58, workingCapitalDays: 45, roce: 38.5 }
    ],
    growth: {
      profitGrowth: { tenYear: 10, fiveYear: 9, threeYear: 11, ttm: 12 },
      salesGrowth: { tenYear: 11, fiveYear: 10, threeYear: 12, ttm: 13 }
    },
    analysis: {
      pros: ["Company is virtually debt-free", "Company has been maintaining a healthy dividend payout of ~60%"],
      cons: ["IT spending delays in western economies"]
    }
  },
  {
    symbol: "ICICIBANK",
    companyName: "ICICI Bank Ltd",
    shortName: "ICICI Bank",
    nseSymbol: "ICICIBANK",
    industry: "Private Banking",
    sector: "Financial Services",
    description: "ICICI Bank Limited is a leading Indian multinational banking and financial services company headquartered in Mumbai.",
    marketData: {
      currentPrice: 1080,
      marketCap: 760000,
      peRatio: 17.8,
      bookValue: 380,
      faceValue: 2,
      dividendYield: 0.9,
      high52Week: 1320,
      low52Week: 980,
      eps: 60.7,
    },
    quarterlyResults: [
      { period: "Dec 2025", sales: 43000, expenses: 26000, operatingProfit: 17000, opm: 39.5, otherIncome: 6500, interest: 1000, depreciation: 800, profitBeforeTax: 16200, taxPercentage: 24, netProfit: 12312, eps: 17.5 }
    ],
    profitLoss: [
      { period: "Mar 2025", sales: 165000, expenses: 100000, operatingProfit: 65000, opm: 39.4, otherIncome: 24000, interest: 4000, depreciation: 3200, profitBeforeTax: 61800, taxPercentage: 24, netProfit: 46968, eps: 66.8, dividendPayout: 20 }
    ],
    balanceSheet: [
      { period: "Mar 2025", equityCapital: 1400, reserves: 260000, borrowings: 1800000, otherLiabilities: 210000, totalLiabilities: 2271400, fixedAssets: 12000, cwip: 800, investments: 520000, otherAssets: 1738600, totalAssets: 2271400 }
    ],
    ratios: [
      { period: "Mar 2025", debtorDays: 0, cashConversionCycle: 0, workingCapitalDays: 0, roce: 18.2 }
    ],
    growth: {
      profitGrowth: { tenYear: 18, fiveYear: 24, threeYear: 28, ttm: 22 },
      salesGrowth: { tenYear: 14, fiveYear: 18, threeYear: 20, ttm: 19 }
    },
    analysis: {
      pros: ["Consistent asset quality improvement with low GNPA/NNPA", "Strong retail loan portfolio and net interest margin"],
      cons: ["Rising cost of deposits across banking sector"]
    }
  },
  {
    symbol: "SBIN",
    companyName: "State Bank of India",
    shortName: "SBI",
    nseSymbol: "SBIN",
    industry: "Public Sector Banking",
    sector: "Financial Services",
    description: "State Bank of India is a Fortune 500 company and the largest public sector bank in India with over 200 years of heritage.",
    marketData: {
      currentPrice: 750,
      marketCap: 669000,
      peRatio: 10.2,
      bookValue: 460,
      faceValue: 1,
      dividendYield: 1.8,
      high52Week: 912,
      low52Week: 580,
      eps: 73.5,
    },
    quarterlyResults: [
      { period: "Dec 2025", sales: 110000, expenses: 84000, operatingProfit: 26000, opm: 23.6, otherIncome: 12000, interest: 2500, depreciation: 1800, profitBeforeTax: 24500, taxPercentage: 25, netProfit: 18375, eps: 20.6 }
    ],
    profitLoss: [
      { period: "Mar 2025", sales: 420000, expenses: 320000, operatingProfit: 100000, opm: 23.8, otherIncome: 45000, interest: 10000, depreciation: 7000, profitBeforeTax: 93000, taxPercentage: 25, netProfit: 69750, eps: 78.1, dividendPayout: 22 }
    ],
    balanceSheet: [
      { period: "Mar 2025", equityCapital: 892, reserves: 410000, borrowings: 5200000, otherLiabilities: 450000, totalLiabilities: 6060892, fixedAssets: 48000, cwip: 2500, investments: 1650000, otherAssets: 4360392, totalAssets: 6060892 }
    ],
    ratios: [
      { period: "Mar 2025", debtorDays: 0, cashConversionCycle: 0, workingCapitalDays: 0, roce: 16.5 }
    ],
    growth: {
      profitGrowth: { tenYear: 16, fiveYear: 32, threeYear: 24, ttm: 20 },
      salesGrowth: { tenYear: 12, fiveYear: 15, threeYear: 16, ttm: 14 }
    },
    analysis: {
      pros: ["Government backed, largest deposit base in India", "Attractive valuation with PE ratio ~ 10"],
      cons: ["Higher exposure to large infrastructure projects"]
    }
  },
  {
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel Ltd",
    shortName: "Airtel",
    nseSymbol: "BHARTIARTL",
    industry: "Telecommunications",
    sector: "Communication Services",
    description: "Bharti Airtel Limited is a leading global telecommunications company with operations in 18 countries across Asia and Africa.",
    marketData: {
      currentPrice: 1150,
      marketCap: 650000,
      peRatio: 38.2,
      bookValue: 180,
      faceValue: 5,
      dividendYield: 0.6,
      high52Week: 1720,
      low52Week: 950,
      eps: 30.1,
    },
    quarterlyResults: [
      { period: "Dec 2025", sales: 42000, expenses: 20000, operatingProfit: 22000, opm: 52.4, otherIncome: 500, interest: 5800, depreciation: 10500, profitBeforeTax: 6200, taxPercentage: 30, netProfit: 4340, eps: 7.6 }
    ],
    profitLoss: [
      { period: "Mar 2025", sales: 160000, expenses: 78000, operatingProfit: 82000, opm: 51.3, otherIncome: 2000, interest: 22000, depreciation: 40000, profitBeforeTax: 22000, taxPercentage: 30, netProfit: 15400, eps: 27.0, dividendPayout: 25 }
    ],
    balanceSheet: [
      { period: "Mar 2025", equityCapital: 2900, reserves: 102000, borrowings: 210000, otherLiabilities: 120000, totalLiabilities: 434900, fixedAssets: 290000, cwip: 12000, investments: 35000, otherAssets: 97900, totalAssets: 434900 }
    ],
    ratios: [
      { period: "Mar 2025", debtorDays: 22, cashConversionCycle: 20, workingCapitalDays: -15, roce: 15.4 }
    ],
    growth: {
      profitGrowth: { tenYear: 12, fiveYear: 28, threeYear: 35, ttm: 26 },
      salesGrowth: { tenYear: 9, fiveYear: 14, threeYear: 17, ttm: 15 }
    },
    analysis: {
      pros: ["Consistent ARPU expansion in Indian mobile telephony", "Robust enterprise and cloud communication business"],
      cons: ["High debt due to 5G spectrum acquisitions"]
    }
  }
];

const seedAll = async () => {
  try {
    console.log("Connecting to MongoDB for full database seed...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    // 1. Seed Stocks into stockdetails
    console.log("Seeding Stocks into StockDetails...");
    for (const stock of initialStocks) {
      await StockDetails.findOneAndUpdate(
        { symbol: stock.symbol },
        { ...stock, lastUpdated: new Date() },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log("Stocks seeded successfully!");

    // 2. Seed Market items
    const fetchAndDumpMarketData = require('../jobs/getMarketData');
    await fetchAndDumpMarketData();

    // 3. Seed IPOs
    const seedOrUpdateIPOs = require('../jobs/getIpoData');
    await seedOrUpdateIPOs();

    // 4. Seed News
    const fetchAndDumpNews = require('../jobs/getNewsData');
    await fetchAndDumpNews();

    // 5. Seed Crypto Pulse
    console.log("Seeding Crypto Pulse data...");
    const cryptoSeedList = [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: "$67,500.00",
        change: 1.45,
        why: "Strong institutional ETF inflows and macro easing sentiment drove consistent spot accumulation.",
        rank: 1
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: "$2,640.00",
        change: 2.85,
        why: "Growing activity on layer-2 networks and staking demand reduced the supply available on exchanges.",
        rank: 2
      },
      {
        symbol: "SOL",
        name: "Solana",
        price: "$168.40",
        change: 5.12,
        why: "Rising on-chain volumes and new app launches attracted fresh buyers to the network.",
        rank: 3
      },
      {
        symbol: "XRP",
        name: "XRP",
        price: "$0.5230",
        change: -2.31,
        why: "Profit booking after a recent rally, along with uncertainty around regulatory updates.",
        rank: 4
      },
      {
        symbol: "BNB",
        name: "BNB",
        price: "$584.10",
        change: -0.87,
        why: "Slight pullback as traders moved funds into higher-beta coins; trend remains range-bound.",
        rank: 5
      },
      {
        symbol: "DOGE",
        name: "Dogecoin",
        price: "$0.1342",
        change: -4.65,
        why: "Social media hype cooled down, so short-term speculative traders exited their positions.",
        rank: 6
      },
      {
        symbol: "ADA",
        name: "Cardano",
        price: "$0.4410",
        change: 1.12,
        why: "Mild recovery supported by broader market sentiment and upgrade announcements.",
        rank: 7
      }
    ];

    for (const c of cryptoSeedList) {
      await Crypto.findOneAndUpdate(
        { symbol: c.symbol },
        { ...c, lastUpdated: new Date() },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log("Crypto pulse seeded successfully!");

    console.log("ALL DATA (Stocks, Market, IPOs, News, Crypto) SEEDED IN MONGODB SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}

module.exports = seedAll;
