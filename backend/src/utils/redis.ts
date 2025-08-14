import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "../lib/logger";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL!);

redis.on("error", (err) => {
  logger.error("Redis error", err);
});

redis
  .set("foo", "bar")
  .then(() => redis.get("foo"))
  .then((val) => logger.info("Value from Redis:", val))
  .catch(logger.error);

export default redis;
