const IPO = require("../model/IPO");

// GET /api/ipo
const getIPOData = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status: new RegExp(`^${status}$`, "i") } : {};
    const ipos = await IPO.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ipos.length,
      data: ipos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch IPO data",
      error: error.message,
    });
  }
};

// POST /api/ipo/add
const addOrUpdateIPO = async (req, res) => {
  try {
    const { name, date, price, size, status, exchange, lotSize, minInvestment } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "IPO name is required" });
    }

    const ipo = await IPO.findOneAndUpdate(
      { name: name.trim() },
      {
        name: name.trim(),
        date: date || "TBA",
        price: price || "TBA",
        size: size || "TBA",
        status: status || "Upcoming",
        exchange: exchange || "NSE / BSE",
        lotSize: lotSize || "N/A",
        minInvestment: minInvestment || "N/A",
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "IPO saved successfully",
      data: ipo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save IPO",
      error: error.message,
    });
  }
};

module.exports = {
  getIPOData,
  addOrUpdateIPO,
};