import { Middleware } from "./interfaces";
import { RequestInfo } from "node-fetch";

export const rotate =
  (baseUrls: [RequestInfo]): Middleware =>
  async (config, next) => {
    const response = await next(config);
    if (!baseUrls.length) return response;
    if (isNaN(config.attempt) || config.attempt <= 0) return response;
    const index = config.attempt % baseUrls.length;
    config.url = baseUrls[index];
    return response;
  };
