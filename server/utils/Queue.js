import Queue from "bull";

const bohemauthQueue = new Queue("bohemauth:queue", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
});

export { bohemauthQueue };
