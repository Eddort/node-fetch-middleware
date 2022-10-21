import { compose, retry, json } from "../src";
import { RequestInit, Response } from "node-fetch";
import nock from "nock";
import "should";

describe("Retry middleware", () => {

  it("retry 4 times by max_retry argument", async () => {
    nock("http://yolo").post("/foo").times(4).reply(500);

    const response = await compose([retry(4)])("http://yolo/foo", {
      method: "POST",
    });
    console.log(await response.text(), '---WTF')
    // await response.text().should.be.fulfilledWith("ok");
  });

  it.skip("retry 4 by next_try function", async () => {
    nock("http://yolo").post("/foo").times(4).reply(200, "ok");
    let cnt = 1;
    const response = await compose([
      retry(1_000, async (config) => {
        if (cnt > 4) return;
        cnt++;
        return config;
      }),
    ])(
      "http://yolo/foo",
      {
        method: "POST",
      }
    );
    await response.text().should.be.fulfilledWith("ok");
  });
});
