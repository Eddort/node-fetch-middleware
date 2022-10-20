import { RequestInit } from "node-fetch";

export interface RequestConfig extends RequestInit {
  baseUrls?: [string];
  url: string;
}
