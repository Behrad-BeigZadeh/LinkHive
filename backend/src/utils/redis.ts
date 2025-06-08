import { createClient } from "redis";
import logger from "../lib/logger";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) =>
  logger.error(`Redis Client Error: ${err.message}`, { stack: err.stack })
);

(async () => {
  try {
    await redis.connect();
    logger.info("Connected to Redis");
    const keys = await redis.keys("*");
    logger.debug(`Redis keys on startup: ${keys.join(", ")}`);
  } catch (err) {
    logger.error(`Error connecting to Redis: ${err}`);
  }
})();

export default redis;
