import factory from "./factory";
import TruliooClient from "../src/TruliooClient";
import waitForExpect from "wait-for-expect";

describe("TruliooClient", () => {
  let truliooClient;
  let publicKey = factory.random.string();
  let accessToken = factory.random.string();

  beforeEach(() => {
    const response = {
      json: jest.fn().mockReturnValue({
        status: 200,
        accessToken: accessToken
      })
    };
    window.fetch = jest.fn().mockResolvedValue(response);
    document.body.innerHTML = `<div id="trulioo-embedid"></div>`;
    TruliooClient.prototype.registerEvents = jest.fn();
  });

  describe("with publicKey", () => {
    beforeEach(() => {
      truliooClient = new TruliooClient({ publicKey });
    });

    it("should construct with publicKey", () => {
      expect(truliooClient.publicKey).toBe(publicKey);
    });

    it("should construct with default accessToken and embedIDURL", () => {
      const defaultAccessTokenURL = `${window.location.origin}/trulioo-api/embedids/tokens`;
      const defaultEmbedIDURL = "https://embedid.trulioo.com/embedid";

      expect(truliooClient.accessTokenURL).toBe(defaultAccessTokenURL);
      expect(truliooClient.embedIDURL).toBe(defaultEmbedIDURL);
    });
  });

  describe("with accessTokenURL and EmbedIDURL", () => {
    let accessTokenURL;
    let embedIDURL;

    beforeEach(() => {
      accessTokenURL = factory.random.string();
      embedIDURL = factory.random.string();
      truliooClient = new TruliooClient({
        publicKey,
        accessTokenURL,
        embedIDURL
      });
    });

    it("should construct with given accessTokenURL", () => {
      expect(truliooClient.accessTokenURL).toBe(
        `${accessTokenURL}/trulioo-api/embedids/tokens`
      );
    });

    it("should construct with given embedIDURL", () => {
      expect(truliooClient.embedIDURL).toBe(embedIDURL);
    });

    it("should set accessToken to truliooClient", async () => {
      expect(
        window.fetch
      ).toHaveBeenCalledWith(
        `${accessTokenURL}/trulioo-api/embedids/tokens/${publicKey}`,
        { method: "POST" }
      );

      await waitForExpect(() => {
        expect(truliooClient.accessToken).toBe(accessToken);
      });
    });

    it("should load iframe", async () => {
      await waitForExpect(() => {
        expect(document.getElementById("embedid-module").src).toMatch(
          `${embedIDURL}/${publicKey}/at/${accessToken}`
        );
      });
    });
  });
});
