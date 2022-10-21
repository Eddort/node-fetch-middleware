import { InternalConfig, Middleware, RequestConfig } from "./interfaces";
import fetch, { Response } from "node-fetch";
import { deepCopy } from "./utils";

const fetchCall = ({ url, ...rest }: RequestConfig) => fetch(url, rest);

export function compose(middleware: Middleware[]): Middleware {
  return (config: RequestConfig, next) => {
    // copy object bcs we can mutate it
    let internalConfig = deepCopy(config) as InternalConfig;
    internalConfig.attempt = 0;

    async function chain(
      config: InternalConfig,
      middleware: Middleware[]
    ): Promise<Response> {
      if (middleware.length === 0) return (next ?? fetchCall)(config);
      return middleware[0](config, (config) =>
        chain(config, middleware.slice(1))
      );
    }

    return chain(internalConfig, middleware);
  };
}

