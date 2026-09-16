const mongoose = require("mongoose");

// ============================================================
// Quarterly Results Schema
// ============================================================

const quarterlyResultSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

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

// ============================================================
// Profit & Loss Schema
// ============================================================

const profitLossSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

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

// ============================================================
// Balance Sheet Schema
// ============================================================

const balanceSheetSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

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

// ============================================================
// Cash Flow Schema
// ============================================================

const cashFlowSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

    cashFromOperatingActivity: Number,
    cashFromInvestingActivity: Number,
    cashFromFinancingActivity: Number,
    netCashFlow: Number,
    freeCashFlow: Number,
    cfoToOperatingProfit: Number,
  },
  { _id: false }
);

// ============================================================
// Ratios Schema
// ============================================================

const ratiosSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

    debtorDays: Number,
    cashConversionCycle: Number,
    workingCapitalDays: Number,
    roce: Number,
  },
  { _id: false }
);

// ============================================================
// Shareholding Schema
// ============================================================

const shareholdingSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },

    promoters: Number,
    fiis: Number,
    diis: Number,
    government: Number,
    public: Number,
    numberOfShareholders: Number,
  },
  { _id: false }
);

// ============================================================
// Growth Schema
// ============================================================

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

// ============================================================
// Analysis Schema
// ============================================================

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

// ============================================================
// Market Data Schema
// ============================================================

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
    // -------------------------
    // Basic Company Information
    // -------------------------

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
      required: true,
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

    // -------------------------
    // Current Market Data
    // -------------------------

    marketData: {
      type: marketDataSchema,
      default: {},
    },

    // -------------------------
    // Quarterly Results
    // -------------------------

    quarterlyResults: {
      type: [quarterlyResultSchema],
      default: [],
    },

    // -------------------------
    // Profit & Loss
    // -------------------------

    profitLoss: {
      type: [profitLossSchema],
      default: [],
    },

    // -------------------------
    // Balance Sheet
    // -------------------------

    balanceSheet: {
      type: [balanceSheetSchema],
      default: [],
    },

    // -------------------------
    // Cash Flow
    // -------------------------

    cashFlow: {
      type: [cashFlowSchema],
      default: [],
    },

    // -------------------------
    // Financial Ratios
    // -------------------------

    ratios: {
      type: [ratiosSchema],
      default: [],
    },

    // -------------------------
    // Shareholding Pattern
    // -------------------------

    shareholding: {
      type: [shareholdingSchema],
      default: [],
    },

    // -------------------------
    // Growth
    // -------------------------

    growth: {
      type: growthSchema,
      default: {},
    },

    // -------------------------
    // Analysis
    // -------------------------

    analysis: {
      type: analysisSchema,
      default: {},
    },

    // -------------------------
    // Last Updated
    // -------------------------

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

// ============================================================
// MODEL
// ============================================================

const StockDetails = mongoose.model("StockDetails", stockDetailsSchema);

module.exports = StockDetails;
