import { InternalConfig, Middleware, RequestConfig } from "./interfaces";
import fetch, { Response } from "node-fetch";
import { deepCopy, getUrl } from "./utils";

const fetchCall = ({ url, baseUrl, ...rest }: RequestConfig) =>
  fetch(getUrl(baseUrl, url), rest);

export function compose(middleware: Middleware[]): Middleware {
  return (requestConfig: RequestConfig, next) => {
    // copy object bcs we can mutate it
    let internalConfig = deepCopy(requestConfig) as InternalConfig;
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
