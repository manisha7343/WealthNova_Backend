const cron = require('node-cron');
const User = require("./model/user"); // check path + case

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('*/2 * * * *', async () => {
    try {
      // console.log("Cron running...");

      const result = await User.updateMany({
        isBlocked: true,
        blockedUntill: { $lt: new Date() }
      }, {
        $set: {
          isBlocked: false,
          loginAttempts: 0,
          blockedUntill: null
        }
      });

      // console.log("Updated users:", result);

    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
}

module.exports = cron;

