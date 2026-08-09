const cron = require('node-cron');
const User = require("./model/user"); // check path + case

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('*/1 * * * *', async () => {
    try {
      

      const result = await User.updateMany({
        isBlocked: true,
        blockedUntil: { $lt: new Date() }
      }, {
        $set: {
          isBlocked: false,
          loginAttempts: 0,
          blockedUntil: null
        }
      });
      // console.log("Cron running...");

      // console.log("Updated users:", result);

    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
}

module.exports = cron;

