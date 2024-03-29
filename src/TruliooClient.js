export default class TruliooClient {
  constructor(obj) {
    for (var fld in obj) {
      this[fld] = obj[fld];
    }
    this.embedIDURL = this.embedIDURL
      ? this.embedIDURL
      : 'https://embedid.trulioo.com/embedid';
    this.accessTokenURL = this.accessTokenURL
      ? `${this.accessTokenURL}/trulioo-api/embedids/tokens`
      : `${window.location.origin}/trulioo-api/embedids/tokens`;

    (async () => {
      try {
        this.registerEvents();
        await this.injectAccessToken();
        await this.loadEmbedID();
      } catch (error) {
        this.errorHandler(
          error,
          'Something went wrong during EmbedID form initialization'
        );
      }
    })();
  }

  /**
   * Registers callbacks.
   */
  registerEvents() {
    const truliooClient = this;
    if (window && window.addEventListener) {
      window.addEventListener('message', onMessage, false);
    }

    function onMessage(event) {
      try {
        const eventOriginCompleteURL = `${event && event.origin}/embedid`;
        // Check sender origin to be trusted
        if (truliooClient.embedIDURL !== eventOriginCompleteURL) {
          return;
        }
        var data = event.data;

        if (truliooClient[data.function]) {
          truliooClient[data.function].call(window, JSON.parse(data.message));
        } else {
          console.log(
            `Tried to trigger ${data.func} but found no available callBack`
          );
        }
      } catch (error) {
        this.errorHandler(
          error,
          'Something went wrong during callback registration'
        );
      }
    }
  }

  /**
   * Generates the access token and stores it into this.accessToken variable.
   */
  async injectAccessToken() {
    try {
      if (!this.accessToken) {
        const originURL = `${this.accessTokenURL}/${this.publicKey}`;
        const response = await fetch(originURL, {
          method: 'POST'
        });
        const deconstructedResult = await response.json();
        if (response && response.status >= 400) {
          throw new Error(deconstructedResult.error || deconstructedResult);
        }
        const accessToken = deconstructedResult.accessToken;
        this.accessToken = accessToken;
      }
    } catch (error) {
      this.errorHandler(
        error,
        'Something went wrong during access token generation'
      );
      throw error;
    }
  }

  addBasicIframeStyles(iframe) {
    iframe.style.border = '0';
    iframe.style.height = 'calc(100vh - 40px)';
    iframe.style.width = '100%';
  }

  loadEmbedID() {
    let experienceUrl = new URL(`${this.embedIDURL}/${this.publicKey}/at/${this.accessToken}`);
    if (this.internalCustomerId) {
      experienceUrl.searchParams.append('internalCustomerId', this.internalCustomerId.replace(/[^0-9A-Z-]+/gi,""));
    }
    if (this.experienceTransactionId) {
      experienceUrl.searchParams.append('experienceTransactionId', this.experienceTransactionId);
    }

    const element = document.createElement('iframe');
    element.setAttribute('id', 'embedid-module');
    element.setAttribute('allow', 'camera');
    element.setAttribute('src', experienceUrl);
    const truliooEmbedIDContainer = document.getElementById('trulioo-embedid');
    truliooEmbedIDContainer.appendChild(element);
    const embedIDModule = document.getElementById('embedid-module');
    this.addBasicIframeStyles(embedIDModule);
  }

  errorHandler(error, errorMsg) {
    // TODO - replace the div with error component
    console.error(errorMsg, error);
  }
}
