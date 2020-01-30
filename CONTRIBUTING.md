# Thank you for wanting to contribute to trulioo-embedid-client

## Run application

You can run the application by instantiating `TruliooClient`:

```
new TruliooClient({
    publicKey, // required
    accessTokenURL, // required
});
```

## Bundling

Webpack is used for package bundling; using `npm run webpack-release` will produce a new bundle under `v1/main.js`.