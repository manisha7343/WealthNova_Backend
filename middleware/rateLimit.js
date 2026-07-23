const redisClient = require("../config/redis");

// configs (tu easily change kar sakta hai)
const PRE_AUTH_LIMIT = 100;     // login/register strict
const USER_LIMIT = 500;      // normal APIs
const WINDOW = 60;           // seconds

// BEFORE LOGIN (IP + EMAIL)
const preAuthRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const email = req.body.email?.toLowerCase().trim();

    if (!email) { 
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const key = `rate_limit:auth:${ip}:${email}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (count > PRE_AUTH_LIMIT) {
      const ttl = await redisClient.ttl(key);

      return res.status(429).json({
        success: false,
        message: "Too many attempts, try later",
        retryAfter: ttl,
      });
    }

    next();
  } catch (err) {
    console.error("Pre-auth rate limit error:", err);
    next();
  }
};

// AFTER LOGIN (USER / JWT)-----------------
const userRateLimiter = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const key = `rate_limit:user:${userId}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, WINDOW);
    }

    if (count > USER_LIMIT) {
      const ttl = await redisClient.ttl(key);

      return res.status(429).json({
        success: false,
        message: "Too many requests",
        retryAfter: ttl,
      });
    }

    next();
  } catch (err) {
    console.error("User rate limit error:", err);
    next();
  }
};

module.exports = {
  preAuthRateLimiter,
  userRateLimiter,
};