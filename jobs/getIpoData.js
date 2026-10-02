const cron = require('node-cron');
const IPO = require('../model/IPO');

const seedOrUpdateIPOs = async () => {
  try {
    console.log("IPO data sync ho raha hai...");

    const ipoList = [
      {
        name: "Swiggy Ltd.",
        date: "Oct 18 - Oct 20, 2026",
        price: "₹370 - ₹390",
        size: "₹10,414 Cr",
        status: "Upcoming",
        exchange: "NSE / BSE",
        lotSize: "38 Shares",
        minInvestment: "₹14,820",
      },
      {
        name: "NTPC Green Energy",
        date: "Nov 05 - Nov 07, 2026",
        price: "₹100 - ₹108",
        size: "₹10,000 Cr",
        status: "Upcoming",
        exchange: "NSE / BSE",
        lotSize: "138 Shares",
        minInvestment: "₹14,904",
      },
      {
        name: "Tata Play",
        date: "TBA",
        price: "TBA",
        size: "₹2,500 Cr",
        status: "Filed DRHP",
        exchange: "NSE / BSE",
        lotSize: "TBA",
        minInvestment: "TBA",
      },
      {
        name: "Hyundai Motor India",
        date: "Closed",
        price: "₹1,865 - ₹1,960",
        size: "₹27,870 Cr",
        status: "Listed",
        exchange: "NSE / BSE",
        lotSize: "7 Shares",
        minInvestment: "₹13,720",
      },
      {
        name: "Ather Energy",
        date: "Nov 22 - Nov 26, 2026",
        price: "₹290 - ₹310",
        size: "₹4,500 Cr",
        status: "Upcoming",
        exchange: "NSE / BSE",
        lotSize: "48 Shares",
        minInvestment: "₹14,880",
      },
      {
        name: "Vishal Mega Mart",
        date: "Dec 02 - Dec 05, 2026",
        price: "₹125 - ₹135",
        size: "₹8,000 Cr",
        status: "Upcoming",
        exchange: "NSE / BSE",
        lotSize: "110 Shares",
        minInvestment: "₹14,850",
      },
    ];

    for (let ipo of ipoList) {
      await IPO.findOneAndUpdate(
        { name: ipo.name },
        { ...ipo, lastUpdated: new Date() },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log("IPO data database mein successfully sync ho gaya!");
  } catch (error) {
    console.error("IPO sync error:", error.message);
  }
};

module.exports = seedOrUpdateIPOs;