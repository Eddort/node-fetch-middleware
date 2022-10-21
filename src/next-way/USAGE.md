```js
return c(
  [
    retry(4, { ms: 200 }),
    rotate(
      ["https://google.com", "https://yahoo.com"],
      prom,
      logging(logger),
      errorNotOk
    ),
  ],
  { url: "/news" }
);
```
