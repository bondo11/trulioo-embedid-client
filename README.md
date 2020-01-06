# trulioo-embedID-client

[![Github](https://github.com/trulioo/trulioo-embedid-client/workflows/Build/badge.svg)](https://github.com/trulioo/trulioo-embedid-client/workflows/Build/badge.svg)

JavaScript library which streamlines integration with Trulioo.

Exposes [TruliooClient](https://github.com/Trulioo/trulioo-embedid-client/blob/master/src/TruliooClient.js) and a function which loads on "DOMContentLoaded", loading Trulioo EmbedID.

# How to render

Drag and drop this snippet of code into your HTML:

```
    <div id="trulioo-embedid"></div>
    <script type="text/javascript"
        src="https://cdn.jsdelivr.net/gh/trulioo/trulioo-embedid-client@master/v1/main.js"/>
    
    <script>
        const publicKey = 'YOUR_API_KEY_GOES_HERE';
        const accessTokenURL = 'YOUR_ACCESS_TOKEN_URL_GOES_HERE'; //i.e.: http://localhost:3222/accessToken
        new TruliooClient({
            publicKey,
            accessTokenURL
        });
    </script>
```