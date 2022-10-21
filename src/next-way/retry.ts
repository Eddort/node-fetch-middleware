import { Middleware } from "./interfaces";
import { Response } from "node-fetch";
import { isNotServerError } from "./utils";

export const retry =
  (maxTries: number = 3, retryConfig: { ignoreAbort: boolean }): Middleware =>
  async (config, next) => {
    let response: Response;
    while (maxTries > config.attempt) {
      config.attempt++;
      try {
        response = await next(config);
      } catch (error) {
        if (error.name === "AbortError" && !retryConfig.ignoreAbort)
          throw error;
        if (isNotServerError(error)) throw error;
        if (maxTries <= config.attempt) throw error;
        // TODO: delay from Kirill method
        response = await next(config);
      }
    }
    return response;
  };
