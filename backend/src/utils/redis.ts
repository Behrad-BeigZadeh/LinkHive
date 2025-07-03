import Redis from "ioredis";

const redis = new Redis({
  host: "redis-15044.c311.eu-central-1-1.ec2.redns.redis-cloud.com",
  port: 15044,
  username: "default",
  password: "91CzzjFlZbzsi5DUjXnTmArwmP5p0N0A",
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

redis
  .set("foo", "bar")
  .then(() => redis.get("foo"))
  .then((val) => console.log("Value from Redis:", val))
  .catch(console.error);

export default redis;
