import '@testing-library/jest-dom/extend-expect';
import TruliooClient from '../src/truliooClient';

test('TruliooClient is instantiated', async () => {
    const publicKey = 'ExamplePublicKey';
    const accessTokenGeneratorURL = 'http://ExampleAccessTokenURL';
    const truliooClient = new TruliooClient({
        publicKey: publicKey,
        accessTokenGeneratorURL: accessTokenGeneratorURL
    });
    expect(truliooClient.publicKey).toBe(publicKey);
    expect(truliooClient.accessTokenGeneratorURL).toBe(accessTokenGeneratorURL);
})