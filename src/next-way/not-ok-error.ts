import { Response } from "node-fetch";
import { HttpException } from "@nestjs/common";
import { Middleware } from "./interfaces";
import { extractErrorBody } from "./utils";

export const notOkError =
  (): Middleware =>
  async (config, next) => {
    let response: Response;
    response = await next(config);
    if (!response?.ok) {
      const errorBody = await extractErrorBody(response);
      throw new HttpException(errorBody, response.status);
    }
    return response;
  };
