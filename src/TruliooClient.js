export default class TruliooClient {

    constructor(publicKey, accessTokenGeneratorURL) {
        console.log('mpika!', publicKey, accessTokenGeneratorURL)
        this.publicKey = publicKey;
        this.accessTokenGeneratorURL = accessTokenGeneratorURL;
        this.loadEmbedID();
    }

    loadEmbedID() {
        const embedIDBackendURL = "http://localhost:8855/embedid/";
        const element = document.createElement('iframe');
        element.setAttribute('id', 'embedid-module');
        element.setAttribute('src', `${embedIDBackendURL}${this.publicKey}`);
        document.getElementById('trulioo-embedid').appendChild(element);

        window.addEventListener('message', async (e) => {
            const originURL = 'http://localhost:8855'; //embedID BE URL
            if (e.origin === originURL) {
                const response = await fetch(`${this.accessTokenGeneratorURL}`);
                const accessToken = JSON.parse(response.data.AccessToken);
                //console.log('Sending Access Access Token fron client to EmbedID-BE:', accessToken);
                //e.source.postMessage(`Ihackedyou;D`, '*');
                //TODO change
                e.source.postMessage(`${accessToken}`, '*');
            }
        });

        const embedIDModule = document.getElementById("embedid-module");
        embedIDModule.style.width = "100%";
        embedIDModule.style.height = "100%";
        embedIDModule.border = "none";
    }
}