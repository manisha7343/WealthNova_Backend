const { log } = require('console');
const { createClient } = require('redis');
require('dotenv').config();


const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16431,
  },
});


redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("connect", () => console.log("Redis connected ✅"));

redis.connect();

module.exports = redis;