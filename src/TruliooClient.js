export default class TruliooClient {

    constructor(obj) {

        for (var fld in obj) {
            this[fld] = obj[fld];
        }
        this.embedIDURL = this.embedIDURL ? this.embedIDURL : "http://localhost:8855/embedid";
        this.init();
    }

    async init() {
        try {
            await this.injectAccessToken();
            this.registerEvents();
            this.loadEmbedID();
        } catch (error) {
            console.error('something went wrong during EmbedID form initialization', error);
        }
    }

    /**
    * Registers callbacks.
    */
    registerEvents() {
        const truliooClient = this;
        if (window && window.addEventListener) {
            window.addEventListener("message", onMessage, false);
        }

        function onMessage(event) {
            try {
                const eventOriginCompleteURL = `${event && event.origin}/embedid`;
                // Check sender origin to be trusted
                if (truliooClient.embedIDURL !== eventOriginCompleteURL) {
                    return;
                }
                var data = event.data;

                // call function
                if (truliooClient[data.function]) {
                    truliooClient[data.function].call(window, JSON.parse(data.message));
                } else {
                    console.log(`Tried to trigger ${data.func} but found no available callBack`);
                }
            } catch (error) {
                console.error('Something went wrong during callback registration', error);
            }
        }
    }

    /**
     * Generates the access token and stores it into this.accessToken variable.
     */
    async injectAccessToken() {
        try {
            const originURL = `${this.accessTokenURL}/${this.publicKey}`;
            const response = await fetch(originURL, {
                method: 'POST'
            });
            const deconstructedResult = await response.json();
            const accessToken = deconstructedResult.accessToken;
            this.accessToken = accessToken;
        } catch (err) {
            console.error('Something went wrong during access token generation', err);
        }
    }

    loadEmbedID() {
        const url = `${embedIDURL}/${this.publicKey}/at/${this.accessToken}`;
        const element = document.createElement('iframe');
        element.setAttribute('id', 'embedid-module');
        element.setAttribute('src', url);
        const truliooEmbedIDContainer = document.getElementById('trulioo-embedid');
        truliooEmbedIDContainer.appendChild(element);

        // styling of the container
        truliooEmbedIDContainer.style.paddingTop = "100%";
        truliooEmbedIDContainer.style.position = "relative";

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