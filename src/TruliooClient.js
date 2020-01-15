export default class TruliooClient {

    constructor(obj) {
        for (var fld in obj) {
            this[fld] = obj[fld];
        }
        this.loadEmbedID();
    }

    loadEmbedID() {
        const embedIDBackendURL = "http://localhost:8855/embedid/";
        const element = document.createElement('iframe');
        element.setAttribute('id', 'embedid-module');
        element.setAttribute('src', `${embedIDBackendURL}${this.publicKey}`);
        const truliooEmbedIDContainer = document.getElementById('trulioo-embedid')
        truliooEmbedIDContainer.appendChild(element);
        truliooEmbedIDContainer.style.paddingTop = "100%";
        truliooEmbedIDContainer.style.position = "relative";
        window.addEventListener('message', async (e) => {
            const expectedEmbedIDBEURL = 'http://localhost:8855';
            const originURL = 'http://localhost:3010/trulioo-api/embedids/tokens'; //embedid-be-sdk
            if (e.origin === expectedEmbedIDBEURL) {
                const response = await fetch(originURL, {
                    method: 'POST'
                });
                const deconstructedResult = await response.json();
                const accessToken = deconstructedResult.accessToken;
                e.source.postMessage(`${accessToken}`, '*');
            }
        });

        const embedIDModule = document.getElementById("embedid-module");
        embedIDModule.style.border = '0';
        embedIDModule.style.height = '100%';
        embedIDModule.style.left = '0';
        embedIDModule.style.position = 'absolute';
        embedIDModule.style.top = '0';
        embedIDModule.style.width = '100%';
    }
}