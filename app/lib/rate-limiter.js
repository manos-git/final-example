import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";

//limit of 1 request per 40 seconds
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "40 s"),
});