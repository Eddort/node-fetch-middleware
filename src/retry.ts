import { Middleware } from "./middleware";
import { Body, RequestInit, Response } from "node-fetch";
import { RequestConfig } from "./interface";

// declare module "node-fetch" {
//   interface Body {
//     parsed?: any;
//   }
//   interface RequestInit {
//     json?: any;
//   }
// }

const silentTry = async (
  config: RequestConfig,
  response: Response,
  error?: Error
) => {
  return config;
};

export const retry =
  (
    maxTries: number = 3,
    nextTry: (
      config: RequestConfig,
      response: Response,
      error?: Error
    ) => Promise<RequestConfig | undefined> = silentTry
  ): Middleware =>
  async (url, init, next) => {
    let response: Response;
    let config;
    let tryNumber = 0;
    do {
      try {
        tryNumber++;
        response = await next(url, config);
        config = await nextTry({ ...init, url: String(url) }, response);
      } catch (error) {
        config = await nextTry({ ...init, url: String(url) }, response, error);
      }
    } while (config && maxTries >= tryNumber);

    return response;
  };

// lifecicle
