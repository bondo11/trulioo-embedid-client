export default class TruliooClient {

    constructor(obj) {
        for (var fld in obj) {
            this[fld] = obj[fld];
        }
        this.init();
    }

    async init() {
        await this.injectAccessToken();
        this.loadEmbedID();
    }

    async injectAccessToken() {
        const originURL = `${accessTokenURL}/${this.publicKey}`;
        const response = await fetch(originURL, {
            method: 'POST'
        });
        const deconstructedResult = await response.json();
        const accessToken = deconstructedResult.accessToken;
        this['accessToken'] = accessToken;
    }

    loadEmbedID() {
        const embedIDBackendURL = !this.embedIDUrl ? "http://localhost:8855/embedid" : this.embedIDUrl;
        const url = `${embedIDBackendURL}/${this.publicKey}/at/${this.accessToken}`;
        const element = document.createElement('iframe');
        element.setAttribute('id', 'embedid-module');
        element.setAttribute('src', url);
        const truliooEmbedIDContainer = document.getElementById('trulioo-embedid');
        truliooEmbedIDContainer.appendChild(element);

        // styling of the container
        truliooEmbedIDContainer.style.paddingTop = "100%";
        truliooEmbedIDContainer.style.position = "relative";

        // TODO update code v2check
        // window.addEventListener('message', async (e) => {
        //     const expectedEmbedIDBEURL = 'http://localhost:8855';
        //     const originURL = 'http://localhost:3010/trulioo-api/embedids/tokens'; //embedid-be-sdk
        //     if (e.origin === expectedEmbedIDBEURL) {
        //         const response = await fetch(originURL, {
        //             method: 'POST'
        //         });
        //         const deconstructedResult = await response.json();
        //         const accessToken = deconstructedResult.accessToken;
        //         e.source.postMessage(`${accessToken}`, '*');
        //     }
        // });

        // styling of the iframe
        const embedIDModule = document.getElementById("embedid-module");
        embedIDModule.style.border = '0';
        embedIDModule.style.height = '100%';
        embedIDModule.style.left = '0';
        embedIDModule.style.position = 'absolute';
        embedIDModule.style.top = '0';
        embedIDModule.style.width = '100%';
    }
}