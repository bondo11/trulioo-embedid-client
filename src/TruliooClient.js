export default class TruliooClient {

    constructor(publicKey, accessTokenGeneratorURL) {
        console.log('mpika!', publicKey, accessTokenGeneratorURL)
        this.publicKey = publicKey;
        this.accessTokenGeneratorURL = accessTokenGeneratorURL;
    }
}