const mongoose = require("mongoose");

// ============================================================
// Sub-Schemas
// ============================================================

const quarterlyResultSchema = new mongoose.Schema(
  {
    period: String,
    sales: Number,
    expenses: Number,
    operatingProfit: Number,
    opm: Number,
    otherIncome: Number,
    interest: Number,
    depreciation: Number,
    profitBeforeTax: Number,
    taxPercentage: Number,
    netProfit: Number,
    eps: Number,
  },
  { _id: false }
);

const profitLossSchema = new mongoose.Schema(
  {
    period: String,
    sales: Number,
    expenses: Number,
    operatingProfit: Number,
    opm: Number,
    otherIncome: Number,
    interest: Number,
    depreciation: Number,
    profitBeforeTax: Number,
    taxPercentage: Number,
    netProfit: Number,
    eps: Number,
    dividendPayout: Number,
  },
  { _id: false }
);

const balanceSheetSchema = new mongoose.Schema(
  {
    period: String,
    equityCapital: Number,
    reserves: Number,
    borrowings: Number,
    otherLiabilities: Number,
    totalLiabilities: Number,
    fixedAssets: Number,
    cwip: Number,
    investments: Number,
    otherAssets: Number,
    totalAssets: Number,
  },
  { _id: false }
);

const cashFlowSchema = new mongoose.Schema(
  {
    period: String,
    cashFromOperatingActivity: Number,
    cashFromInvestingActivity: Number,
    cashFromFinancingActivity: Number,
    netCashFlow: Number,
    freeCashFlow: Number,
    cfoToOperatingProfit: Number,
  },
  { _id: false }
);

const ratiosSchema = new mongoose.Schema(
  {
    period: String,
    debtorDays: Number,
    cashConversionCycle: Number,
    workingCapitalDays: Number,
    roce: Number,
  },
  { _id: false }
);

const shareholdingSchema = new mongoose.Schema(
  {
    period: String,
    promoters: Number,
    fiis: Number,
    diis: Number,
    government: Number,
    public: Number,
    numberOfShareholders: Number,
  },
  { _id: false }
);

const growthSchema = new mongoose.Schema(
  {
    salesGrowth: {
      tenYear: Number,
      fiveYear: Number,
      threeYear: Number,
      ttm: Number,
    },
    profitGrowth: {
      tenYear: Number,
      fiveYear: Number,
      threeYear: Number,
      ttm: Number,
    },
    stockPriceCagr: {
      tenYear: Number,
      fiveYear: Number,
      threeYear: Number,
      oneYear: Number,
    },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    pros: {
      type: [String],
      default: [],
    },
    cons: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const marketDataSchema = new mongoose.Schema(
  {
    currentPrice: Number,
    marketCap: Number,
    peRatio: Number,
    bookValue: Number,
    faceValue: Number,
    dividendYield: Number,
    high52Week: Number,
    low52Week: Number,
    eps: Number,
    lastUpdated: Date,
  },
  { _id: false }
);

// ============================================================
// MAIN STOCK DETAILS SCHEMA
// ============================================================

const stockDetailsSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    nseSymbol: {
      type: String,
      trim: true,
      uppercase: true,
    },
    bseCode: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Sub-document objects and arrays
    marketData: marketDataSchema,
    quarterlyResults: [quarterlyResultSchema],
    profitLoss: [profitLossSchema],
    balanceSheet: [balanceSheetSchema],
    cashFlow: [cashFlowSchema],
    ratios: [ratiosSchema],
    shareholding: [shareholdingSchema],
    growth: growthSchema,
    analysis: analysisSchema,

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StockDetails = mongoose.model("StockDetails", stockDetailsSchema);

module.exports = StockDetails;