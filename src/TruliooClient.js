class TruliooClient {

    constructor(config) {
        const { publicKey, accessTokenGeneratorURL } = config;
        this.publicKey = publicKey;
        this.accessTokenGeneratorURL = accessTokenGeneratorURL;
    }
}

export default TruliooClient;