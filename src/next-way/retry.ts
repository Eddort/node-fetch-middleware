import { Middleware } from "./interfaces";
import { Response } from "node-fetch";
import { isNotServerError } from "./utils";

export const retry =
  (maxTries: number = 3): Middleware =>
  async (config, next) => {
    let response: Response;
    while (maxTries > config.attempt) {
      config.attempt++;
      try {
        response = await next(config);
      } catch (error) {
        // TODO: abort Error
        if (isNotServerError(error)) throw error;
        if (maxTries <= config.attempt) throw error;
        // TODO: url from config
        // TODO: delay from Kirill method
        response = await next(config);
      }
    }
    return response;
  };
