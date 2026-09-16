const axios = require("axios");
const Stock = require("../model/stockDetails");

// ==========================================
// FIELD-NAME UNCERTAINTY HANDLING
// Humein exact RapidAPI response shape nahi pata (aur API hits limited hain),
// isliye ye helper multiple possible key-names try karta hai ek saath.
// Jab bhi asli field name pata chale, bas 'keys' array me add kar do.
// ==========================================
const pick = (obj, keys, fallback = undefined) => {
  if (!obj || typeof obj !== "object") return fallback;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
};
const pickNum = (obj, keys, fallback = 0) => {
  const v = pick(obj, keys, undefined);
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const RAPID_API_HOST = process.env.RAPIDAPI_HOST || "indian-stock-market-ipo-api.p.rapidapi.com";
const RAPID_API_KEY = process.env.RAPIDAPI_KEY;

const apiHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  "x-rapidapi-host": RAPID_API_HOST,
  "x-rapidapi-key": RAPID_API_KEY,
};

const TTL_MS = 15 * 60 * 1000; // 15 min cache

// RapidAPI wrapped responses ko handle karne ke liye ({status, data:[...]} ya seedha array)
const toArray = (d) => (Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);

// company/quarters endpoint asal me SHAREHOLDING pattern deta hai (quarterly P&L nahi).
// Shape: [{ FIIs: {"Sep 2023":"44.39%", ...}, period:"quarterly" }, { DIIs: {...} }, ...]
// Isko schema ke shareholding array format me pivot karna hai: [{period, fiis, diis, ...}]
const parsePercent = (v) => {
  if (v === undefined || v === null) return 0;
  const n = parseFloat(String(v).replace("%", "").trim());
  return Number.isFinite(n) ? n : 0;
};
const parseIndianNumber = (v) => {
  if (v === undefined || v === null) return 0;
  const n = parseInt(String(v).replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
};

const transformShareholding = (rawItems, periodType = "quarterly") => {
  const items = toArray(rawItems).filter((it) => it && it.period === periodType);
  if (items.length === 0) return [];

  // Har item ek metric hai (FIIs/DIIs/Government/Public/No of Shareholders).
  // Ek period-label -> combined-row map banate hain.
  const rowsByPeriod = {};

  const metricKeyMap = {
    FIIs: "fiis",
    DIIs: "diis",
    Government: "government",
    Public: "public",
    "No of Shareholders": "numberOfShareholders",
    Promoters: "promoters", // agar kabhi aaye
  };

  for (const item of items) {
    for (const metricName of Object.keys(item)) {
      if (metricName === "period") continue;
      const schemaKey = metricKeyMap[metricName];
      if (!schemaKey) continue; // unknown metric, skip

      const periodValues = item[metricName] || {};
      for (const periodLabel of Object.keys(periodValues)) {
        if (!rowsByPeriod[periodLabel]) {
          rowsByPeriod[periodLabel] = { period: periodLabel };
        }
        const raw = periodValues[periodLabel];
        rowsByPeriod[periodLabel][schemaKey] =
          schemaKey === "numberOfShareholders" ? parseIndianNumber(raw) : parsePercent(raw);
      }
    }
  }

  return Object.values(rowsByPeriod);
};

// ==========================================
// Postman Endpoint: POST /api/stocks/manual-add
// Body me JSON bhejo, seedha DB me save hoga — RapidAPI ko bilkul touch nahi karta.
// Testing ke liye jab quota khatam ho ya API down ho.
// ==========================================
const manualAddStock = async (req, res) => {
  try {
    const body = req.body;

    if (!body || !body.symbol) {
      return res.status(400).json({
        error: "Body me 'symbol' field zaruri hai (minimum requirement)",
        example: {
          symbol: "ICICIBANK",
          companyName: "ICICI Bank Limited",
          marketData: { currentPrice: 1245.5, marketCap: 875000, peRatio: 18.4 },
        },
      });
    }

    const symbol = String(body.symbol).toUpperCase();

    const payload = {
      ...body,
      symbol,
      lastUpdated: new Date(),
    };

    const saved = await Stock.findOneAndUpdate(
      { symbol },
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: `${symbol} manually DB me save ho gaya (0 API hit spent)`,
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Manual save me dikkat aayi",
      details: error.message,
    });
  }
};

const syncSingleStock = async (req, res) => {
  try {
    if (!RAPID_API_KEY) {
      return res.status(500).json({ error: "RAPIDAPI_KEY env me set nahi hai" });
    }

    const symbol = req.params.symbol.toUpperCase();
    const force = req.query.force === "true";

    // 1. Time-based cache (permanent nahi, TTL ke saath)
    const existingStock = await Stock.findOne({ symbol }).lean();
    if (existingStock && !force) {
      const age = Date.now() - new Date(existingStock.lastUpdated).getTime();
      if (age < TTL_MS) {
        return res.status(200).json({
          message: `${symbol} ka fresh data DB me hai (0 API hit spent)`,
          data: existingStock,
        });
      }
    }

    console.log(`RapidAPI se ${symbol} ka data fetch ho raha hai...`);

    const requestBody = new URLSearchParams();
    requestBody.append("company_id", symbol);

    // IMPORTANT: RapidAPI concurrent requests par 429 (rate limit) de raha tha
    // jab Promise.all se 4 calls ek saath fire hoti thi. Ab sequential (ek-ek karke)
    // chalayenge, har call ke beech thoda gap dekar, taaki rate limit na lage.
    const hit = async (path) => {
      try {
        const r = await axios.post(`https://${RAPID_API_HOST}/${path}`, requestBody.toString(), { headers: apiHeaders });
        return r;
      } catch (e) {
        return {
          data: {},
          __error: e.response ? `${e.response.status}: ${JSON.stringify(e.response.data)}` : e.message,
        };
      }
    };
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const summaryRes = await hit("company/summary");
    await wait(5000); // 5 sec gap — 1.2 sec kaafi nahi tha, 429 phir bhi aa raha tha
    const quartersRes = await hit("company/quarters"); // NOTE: ye asal me SHAREHOLDING data deta hai, quarterly P&L nahi
    await wait(5000);
    const pnlRes = await hit("company/profit-loss");
    await wait(5000);
    const docsRes = await hit("company/documents");

    // Kaunsa endpoint fail hua (galat path / 404 / quota) — ye log karega taaki
    // ek hi costly hit me pata chal jaye kya sahi hai kya nahi, dobara try na karna pade.
    const endpointStatus = {
      summary: summaryRes.__error ? `FAILED: ${summaryRes.__error}` : "OK",
      quarters: quartersRes.__error ? `FAILED: ${quartersRes.__error}` : "OK",
      profitLoss: pnlRes.__error ? `FAILED: ${pnlRes.__error}` : "OK",
      documents: docsRes.__error ? `FAILED: ${docsRes.__error}` : "OK",
    };
    console.log("ENDPOINT STATUS:", endpointStatus);

    // Wrapped response ({status,data:{...}}) ho sakta hai — dono handle karo
    const summaryRaw = summaryRes.data || {};
    const summary = summaryRaw.data && typeof summaryRaw.data === "object" ? summaryRaw.data : summaryRaw;

    const price = pickNum(summary, [
      "current_price", "currentPrice", "price", "cp", "ltp", "last_price", "lastPrice",
    ]);

    // 2. Silent-failure guard — agar API se kuch bhi valid nahi aaya, DB me garbage save mat karo
    if (Object.keys(summary).length === 0 || !price) {
      // Agar stale data pehle se DB me hai, force-refresh fail hone par wahi lauta do
      if (existingStock) {
        return res.status(200).json({
          message: `${symbol} ka naya data nahi mila, purana (stale) data return kar rahe hain`,
          data: existingStock,
        });
      }
      return res.status(502).json({
        error: `${symbol} ka valid data RapidAPI se nahi mila, DB me kuch save nahi kiya`,
        hint: "company_id galat ho sakta hai, ya RAPIDAPI key/quota issue hai",
      });
    }

    const stockPayload = {
      symbol,
      companyName: pick(summary, ["company_name", "companyName", "name", "company"], symbol),
      shortName: pick(summary, ["short_name", "shortName", "shortname"], symbol),
      industry: pick(summary, ["industry"], "N/A"),
      sector: pick(summary, ["sector"], "N/A"),
      description: pick(summary, ["description", "about"], ""),
      website: pick(summary, ["website", "website_url"], ""),
      marketData: {
        currentPrice: price,
        marketCap: pickNum(summary, ["market_cap", "marketCap", "mcap"]),
        peRatio: pickNum(summary, ["pe_ratio", "peRatio", "pe"]),
        high52Week: pickNum(summary, ["high_52_week", "high52Week", "52w_high", "yearHigh"]),
        low52Week: pickNum(summary, ["low_52_week", "low52Week", "52w_low", "yearLow"]),
        lastUpdated: new Date(),
      },
      // IMPORTANT: raw response yahin save ho raha hai — exact field names baad me
      // isi DB record se dekh sakte ho, bina koi extra API hit kharch kiye.
      // Debug: kaunsa endpoint fail hua, kis wajah se — taaki galat path turant pata chale
      rawApiResponse: {
        summary: summaryRaw,
        quarters: quartersRes.data,
        profitLoss: pnlRes.data,
        documents: docsRes.data,
        _endpointStatus: endpointStatus,
      },
      quarterlyResults: [], // "company/quarters" endpoint asal quarterly P&L nahi deta — is API me abhi tak koi endpoint quarterly financials ka nahi mila. Neeche note dekho.
      shareholding: transformShareholding(quartersRes.data, "quarterly"),
      profitLoss: toArray(pnlRes.data),
      documents: toArray(docsRes.data),
      lastUpdated: new Date(),
    };

    const dumpedStock = await Stock.findOneAndUpdate(
      { symbol },
      { $set: stockPayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: `Success! ${symbol} ka data successfully dump ho gaya.`,
      data: dumpedStock,
    });
  } catch (error) {
    console.error("Dump Error:", error.response ? error.response.data : error.message);
    return res.status(500).json({
      error: "Data dump me failover issue aaya",
      details: error.response ? error.response.data : error.message,
    });
  }
};

// ==========================================
// Postman Endpoint: POST /api/stocks/sync-batch  body: { symbols: [...] }
// ==========================================
const MAX_BATCH_SIZE = 25;

const fetchAndSaveBatch = async (req, res) => {
  try {
    if (!RAPID_API_KEY) {
      return res.status(500).json({ error: "RAPIDAPI_KEY env me set nahi hai" });
    }

    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ error: "Body me non-empty symbols array zaruri hai!" });
    }

    if (symbols.length > MAX_BATCH_SIZE) {
      return res.status(400).json({
        error: `Ek baar me max ${MAX_BATCH_SIZE} symbols allowed hain, tumne ${symbols.length} bheje`,
      });
    }

    const dumpedList = [];
    const failedList = [];

    for (const sym of symbols) {
      const cleanSymbol = String(sym).toUpperCase();
      try {
        const requestBody = new URLSearchParams();
        requestBody.append("company_id", cleanSymbol);

        const response = await axios.post(
          `https://${RAPID_API_HOST}/company/summary`,
          requestBody.toString(),
          { headers: apiHeaders }
        );

        const summary = response.data || {};
        const price = Number(summary.current_price || summary.currentPrice) || 0;

        if (Object.keys(summary).length === 0 || !price) {
          failedList.push({ symbol: cleanSymbol, reason: "Valid data nahi mila (empty/zero response)" });
          continue;
        }

        // $set + dot notation: nested marketData ko replace nahi, merge karta hai
        await Stock.findOneAndUpdate(
          { symbol: cleanSymbol },
          {
            $set: {
              symbol: cleanSymbol,
              companyName: summary.company_name || summary.companyName || cleanSymbol,
              industry: summary.industry || "N/A",
              "marketData.currentPrice": price,
              "marketData.marketCap": Number(summary.market_cap || summary.marketCap) || 0,
              lastUpdated: new Date(),
            },
          },
          { upsert: true, setDefaultsOnInsert: true }
        );

        dumpedList.push(cleanSymbol);
      } catch (err) {
        console.error(`${cleanSymbol} dump fail ho gaya:`, err.response ? err.response.data : err.message);
        failedList.push({ symbol: cleanSymbol, reason: err.message });
      }
    }

    return res.status(200).json({
      message: "Batch DB Dump complete!",
      totalDumped: dumpedList.length,
      totalFailed: failedList.length,
      dumpedSymbols: dumpedList,
      failedSymbols: failedList,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { syncSingleStock, fetchAndSaveBatch, manualAddStock };
