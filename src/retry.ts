import { Middleware } from "./middleware";
import { Body, RequestInit, Response } from "node-fetch";
import { RequestConfig } from "./interface";
import { HttpException } from "@nestjs/common";

// declare module "node-fetch" {
//   interface Body {
//     parsed?: any;
//   }
//   interface RequestInit {
//     json?: any;
//   }
// }

let t = 0;
/**
 * нужно из этого калбека уметь откидывать ошибку
 * и менять конфиг для ротации урлов
 * @param config
 * @param response
 * @param error
 * @returns
 */
const silentTry = async (
  config: RequestConfig,
  response: Response,
  error?: Error
) => {
    config.
  console.log(t++, "tryies");
  if (error) return error;
  if (!response?.ok) {
    const errorBody = await extractErrorBody(response);
    return new HttpException(errorBody, response.status);
  }
  return config;
};

export const retry =
  (
    maxTries: number = 3,
    nextTry: (
      config: RequestConfig,
      response: Response,
      error?: Error
    ) => Promise<RequestConfig | Error | null> = silentTry
  ): Middleware =>
  async (url, init, next) => {
    let response: Response;
    let config: RequestInit | Error | null = init;
    let tryAttempt = 0;
    while (!(config instanceof Error) && maxTries > tryAttempt) {
      try {
        tryAttempt++;
        console.log(tryAttempt);
        response = await next(url, config);
        // console.log(response)
        config = await nextTry({ ...config, url: String(url) }, response);
      } catch (error) {
        config = await nextTry(
          { ...config, url: String(url) },
          response,
          error
        );
      }
    }
    console.log(tryAttempt, response, "res!!");
    return response;
  };

// lifecicle
