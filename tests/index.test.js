import waitForExpect from 'wait-for-expect';
import factory from './factory';
import TruliooClient from '../src/TruliooClient';

describe('TruliooClient', () => {
  let truliooClient;
  const publicKey = factory.random.guidToken();
  const accessToken = factory.random.guidToken();
  const embedIDURL = factory.random.url();
  const internalCustomerId = factory.random.guidToken();
  const experienceTransactionId = factory.random.guidToken();

  beforeEach(() => {
    const response = {
      status: 200,
      json: jest.fn().mockResolvedValue({
        accessToken,
      }),
    };
    window.fetch = jest.fn().mockResolvedValue(response);
    document.body.innerHTML = `<div id="trulioo-embedid"></div>`;
    TruliooClient.prototype.registerEvents = jest.fn();
  });

  describe('with publicKey only', () => {
    beforeEach(() => {
      truliooClient = new TruliooClient({ publicKey });
    });

    it('should construct with publicKey', () => {
      expect(truliooClient.publicKey).toBe(publicKey);
    });

    it('should construct with default accessToken and embedIDURL', () => {
      const defaultAccessTokenURL = `${window.location.origin}/trulioo-api/embedids/tokens`;
      const defaultEmbedIDURL = 'https://embedid.trulioo.com/embedid';

      expect(truliooClient.accessTokenURL).toBe(defaultAccessTokenURL);
      expect(truliooClient.embedIDURL).toBe(defaultEmbedIDURL);
    });
  });

  describe('with EmbedIDURL', () => {
    describe('with access token provided in the TruliooClient parameter', () => {
      beforeEach(() => {
        truliooClient = new TruliooClient({
          publicKey,
          accessToken,
          embedIDURL,
        });
      });

      it('should not call the embedid middleware url', async () => {
        expect(window.fetch).not.toHaveBeenCalled();
      });

      it('should set accessToken to truliooClient', async () => {
        expect(truliooClient.accessToken).toBe(accessToken);
      });

      it('should load iframe', async () => {
        await waitForExpect(() => {
          const iFrames = document.getElementsByTagName('iframe');
          expect(iFrames).toHaveLength(1);
        });

        await waitForExpect(() => {
          expect(document.getElementById('embedid-module').src).toMatch(`${embedIDURL}/${publicKey}/at/${accessToken}`);
        });
      });
    });

    const responseCases = [
      ['with internalCustomerId', { internalCustomerId, expectedParams: `?internalCustomerId=${internalCustomerId}` }],
      [
        'with experienceTransactionId',
        { experienceTransactionId, expectedParams: `?experienceTransactionId=${experienceTransactionId}` },
      ],
      [
        'with internalCustomerId and experienceTransactionId',
        {
          internalCustomerId,
          experienceTransactionId,
          expectedParams: `?internalCustomerId=${internalCustomerId}&experienceTransactionId=${experienceTransactionId}`,
        },,
      ],
    ];

    describe.each(responseCases)('%s', (testCase, { internalCustomerId, experienceTransactionId, expectedParams }) => {
      beforeEach(() => {
        truliooClient = new TruliooClient({
          publicKey,
          internalCustomerId,
          experienceTransactionId,
          accessToken,
          embedIDURL,
        });
      });

      it('should load iframe with the correct url parameters', async () => {
        await waitForExpect(() => {
          const iFrames = document.getElementsByTagName('iframe');
          expect(iFrames).toHaveLength(1);
        });

        await waitForExpect(() => {
          expect(document.getElementById('embedid-module').src).toMatch(
            `${embedIDURL}/${publicKey}/at/${accessToken}${expectedParams}`
          );
        });
      });

        });


    describe('with accessTokenURL', () => {
      let accessTokenURL;

      beforeEach(() => {
        accessTokenURL = factory.random.url();
      });

      describe('and access token get call returns 200 status', () => {
        beforeEach(() => {
          truliooClient = new TruliooClient({
            publicKey,
            accessTokenURL,
            embedIDURL,
          });
        });

        it('should construct with given accessTokenURL', () => {
          expect(truliooClient.accessTokenURL).toBe(`${accessTokenURL}/trulioo-api/embedids/tokens`);
        });

        it('should construct with given embedIDURL', () => {
          expect(truliooClient.embedIDURL).toBe(embedIDURL);
        });

        it('should set accessToken to truliooClient', async () => {
          expect(window.fetch).toHaveBeenCalledWith(`${accessTokenURL}/trulioo-api/embedids/tokens/${publicKey}`, {
            method: 'POST',
          });

          await waitForExpect(() => {
            expect(truliooClient.accessToken).toBe(accessToken);
          });
        });

        it('should load iframe', async () => {
          await waitForExpect(() => {
            const iFrames = document.getElementsByTagName('iframe');
            expect(iFrames).toHaveLength(1);
          });

          await waitForExpect(() => {
            expect(document.getElementById('embedid-module').src).toMatch(
              `${embedIDURL}/${publicKey}/at/${accessToken}`
            );
          });
        });
      });

      describe('and access token get call returns non-200 status', () => {
        const errorMessage = factory.random.string();

        const responseCases = [
          ['response has error field', { error: errorMessage }],
          ['response does not have error field', errorMessage],
        ];

        describe.each(responseCases)('and %s', (testCase, responseBody) => {
          beforeEach(() => {
            const response = {
              status: factory.random.errorStatus(),
              json: jest.fn().mockResolvedValue(responseBody),
            };
            window.fetch = jest.fn().mockResolvedValue(response);

            truliooClient = new TruliooClient({
              publicKey,
              accessTokenURL,
              embedIDURL,
            });
          });

          it('should construct with given embedIDURL', () => {
            expect(truliooClient.embedIDURL).toBe(embedIDURL);
          });

          it('should console error the error and a message', async () => {
            console.error = jest.fn();

            expect(window.fetch).toHaveBeenCalledWith(`${accessTokenURL}/trulioo-api/embedids/tokens/${publicKey}`, {
              method: 'POST',
            });

            await waitForExpect(() => {
              expect(console.error).toHaveBeenCalledWith(
                'Something went wrong during access token generation',
                new Error(errorMessage)
              );
            });

            await waitForExpect(() => {
              expect(console.error).toHaveBeenCalledWith(
                'Something went wrong during EmbedID form initialization',
                new Error(errorMessage)
              );
            });
          });

          it('should not create iframe for embedid form', async () => {
            await waitForExpect(() => {
              const iFrames = document.getElementsByTagName('iframe');
              expect(iFrames).toHaveLength(0);
            });

            await waitForExpect(() => {
              expect(document.getElementById('embedid-module')).toBeNull();
            });
          });
        });
      });
    });
  });
});
