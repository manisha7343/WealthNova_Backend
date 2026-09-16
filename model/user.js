const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC COMPANY INFORMATION
    // =========================
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      trim: true,
    },

    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    isin: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
    },

    sector: {
      type: String,
    },

    description: {
      type: String,
    },

    website: {
      type: String,
    },

    // NSE / BSE symbols
    nseSymbol: {
      type: String,
    },

    bseCode: {
      type: String,
    },

    // =========================
    // MARKET DATA
    // =========================
    marketData: {
      currentPrice: Number,

      marketCap: Number,

      enterpriseValue: Number,

      bookValue: Number,

      faceValue: Number,

      peRatio: Number,

      priceToBook: Number,

      dividendYield: Number,

      eps: Number,

      high52Week: Number,

      low52Week: Number,

      beta: Number,

      sharesOutstanding: Number,

      lastUpdated: Date,
    },

    // =========================
    // PROFIT & LOSS
    // YEARLY
    // =========================
    profitLoss: [
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

        tax: Number,

        taxPercentage: Number,

        netProfit: Number,

        eps: Number,

        dividendPayout: Number,
      },
    ],

    // =========================
    // QUARTERLY RESULTS
    // =========================
    quarterlyResults: [
      {
        quarter: {
          type: String,
          // Example: "Jun 2026"
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

        salesGrowth: Number,

        profitGrowth: Number,
      },
    ],

    // =========================
    // BALANCE SHEET
    // =========================
    balanceSheet: [
      {
        period: String,

        // Liabilities
        equityCapital: Number,

        reserves: Number,

        borrowings: Number,

        otherLiabilities: Number,

        totalLiabilities: Number,

        // Assets
        fixedAssets: Number,

        cwip: Number,

        investments: Number,

        otherAssets: Number,

        totalAssets: Number,
      },
    ],

    // =========================
    // CASH FLOW
    // =========================
    cashFlow: [
      {
        period: String,

        cashFromOperatingActivity: Number,

        cashFromInvestingActivity: Number,

        cashFromFinancingActivity: Number,

        netCashFlow: Number,

        freeCashFlow: Number,

        cfoToOperatingProfit: Number,
      },
    ],

    // =========================
    // RATIOS
    // =========================
    ratios: [
      {
        period: String,

        // Profitability
        roe: Number,

        roce: Number,

        roa: Number,

        roic: Number,

        operatingProfitMargin: Number,

        netProfitMargin: Number,

        grossProfitMargin: Number,

        // Valuation
        peRatio: Number,

        priceToBook: Number,

        pegRatio: Number,

        dividendYield: Number,

        // Leverage
        debtToEquity: Number,

        debtToAsset: Number,

        interestCoverage: Number,

        // Efficiency
        debtorDays: Number,

        inventoryDays: Number,

        daysPayable: Number,

        cashConversionCycle: Number,

        workingCapitalDays: Number,

        assetTurnover: Number,

        // Per share
        eps: Number,

        bookValuePerShare: Number,
      },
    ],

    // =========================
    // GROWTH METRICS
    // =========================
    growth: {
      salesGrowth: {
        oneYear: Number,
        threeYear: Number,
        fiveYear: Number,
        tenYear: Number,
        ttm: Number,
      },

      profitGrowth: {
        oneYear: Number,
        threeYear: Number,
        fiveYear: Number,
        tenYear: Number,
        ttm: Number,
      },

      stockPriceCagr: {
        oneYear: Number,
        threeYear: Number,
        fiveYear: Number,
        tenYear: Number,
      },

      epsGrowth: {
        oneYear: Number,
        threeYear: Number,
        fiveYear: Number,
        tenYear: Number,
      },
    },

    // =========================
    // SHAREHOLDING PATTERN
    // =========================
    shareholding: [
      {
        period: String,

        promoters: Number,

        fiis: Number,

        diis: Number,

        government: Number,

        public: Number,

        otherShareholders: Number,

        numberOfShareholders: Number,
      },
    ],

    // =========================
    // PEERS
    // =========================
    peers: [
      {
        stockId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
        },

        symbol: String,

        companyName: String,

        marketCap: Number,

        currentPrice: Number,

        peRatio: Number,

        bookValue: Number,

        dividendYield: Number,

        roce: Number,

        roe: Number,

        debtToEquity: Number,

        netProfit: Number,

        sales: Number,
      },
    ],

    // =========================
    // STOCK PRICE HISTORY
    // FOR CHART
    // =========================
    priceHistory: [
      {
        date: {
          type: Date,
        },

        open: Number,

        high: Number,

        low: Number,

        close: Number,

        volume: Number,

        adjustedClose: Number,
      },
    ],

    // =========================
    // ANALYSIS / KEY POINTS
    // =========================
    analysis: {
      keyPoints: [
        {
          title: String,
          description: String,
        },
      ],

      pros: [String],

      cons: [String],

      analystNotes: String,
    },

    // =========================
    // INVESTORS
    // =========================
    investors: [
      {
        investorName: String,

        investorType: {
          type: String,
          enum: [
            "Promoter",
            "FII",
            "DII",
            "Mutual Fund",
            "Insurance",
            "Government",
            "Public",
            "Other",
          ],
        },

        percentageHolding: Number,

        sharesHeld: Number,

        period: String,
      },
    ],

    // =========================
    // DOCUMENTS
    // =========================
    documents: [
      {
        title: String,

        documentType: {
          type: String,
          enum: [
            "Annual Report",
            "Quarterly Report",
            "Investor Presentation",
            "Conference Call",
            "Announcement",
            "DRHP",
            "Other",
          ],
        },

        url: String,

        date: Date,

        description: String,
      },
    ],

    // =========================
    // META
    // =========================
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);