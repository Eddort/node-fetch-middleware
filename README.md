```js
return c([retry(4, { ms: 200 }), rotate(["1", "2"], prom, logging(cb), errorNotOk)]);
```
