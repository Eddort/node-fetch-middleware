import { Response, FetchError, RequestInfo } from "node-fetch";
import { HttpException } from "@nestjs/common";

export const extractErrorBody = async (response: Response) => {
  try {
    return await response.json();
  } catch (error) {
    return response.statusText;
  }
};

export const isNotServerError = (error: Error) =>
  !(error instanceof HttpException) && !(error instanceof FetchError);

export const deepCopy = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepCopy(item);
      return arr;
    }, []);
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key] = deepCopy(obj[key]);
      return newObj;
    }, {});
  }
};

export const getUrl = (
  baseUrl: RequestInfo | null,
  url: RequestInfo
): RequestInfo => {
  if (typeof url !== "string") return url;
  if (baseUrl == null) return url;
  if (isAbsoluteUrl(url)) return url;

  return `${baseUrl}${url}`;
};

export const isAbsoluteUrl = (url: RequestInfo): boolean => {
  const regexp = new RegExp("^(?:[a-z]+:)?//", "i");
  return regexp.test(url.toString());
};
