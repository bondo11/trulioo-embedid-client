import '@testing-library/jest-dom/extend-expect';
import TruliooClient from '../src/TruliooClient';

test('TruliooClient is instantiated', async () => {
    const publicKey = 'ExamplePublicKey';
    const accessTokenGeneratorURL = 'http://ExampleAccessTokenURL';
    const truliooClient = new TruliooClient(publicKey, accessTokenGeneratorURL);
    expect(truliooClient.publicKey).toBe(publicKey);
    expect(truliooClient.accessTokenGeneratorURL).toBe(accessTokenGeneratorURL);
})