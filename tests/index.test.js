import factory from "./factory";
import TruliooClient from "../src/TruliooClient";

describe("TruliooClient", () => {
  const publicKey = factory.random.string();
  const accessTokenURL = factory.random.string();
  const embedIDURL = factory.random.string();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("instantiate client", () => {
    beforeEach(() => {
      jest.spyOn(TruliooClient.prototype, "init").mockReturnValueOnce();
    });

    it("should construct with public key", () => {
      const truliooClient = new TruliooClient({ publicKey });

      expect(truliooClient.publicKey).toBe(publicKey);
      expect(truliooClient.init).toBeCalledTimes(1);
    });

    it("should construct with accessTokenURL set to user provided value", () => {
      const truliooClient = new TruliooClient({ publicKey, accessTokenURL });

      expect(truliooClient.accessTokenURL).toBe(
        `${accessTokenURL}/trulioo-api/embedids/tokens`
      );
    });

    it("should construct with accessTokenURL set to default", () => {
      const truliooClient = new TruliooClient({ publicKey });

      expect(truliooClient.accessTokenURL).toBe(
        `${window.location.origin}/trulioo-api/embedids/tokens`
      );
    });

    it("should construct with embedIDURL set to user provided value", () => {
      const truliooClient = new TruliooClient({ publicKey, embedIDURL });

      expect(truliooClient.embedIDURL).toBe(embedIDURL);
    });

    it("should construct with embedIDURL set to default", () => {
      const truliooClient = new TruliooClient({ publicKey });

      expect(truliooClient.embedIDURL).toBe(
        "https://embedid.trulioo.com/embedid"
      );
    });
  });
  describe("init", () => {
    it("should call init", async () => {
      jest
        .spyOn(TruliooClient.prototype, "injectAccessToken")
        .mockResolvedValueOnce();
      jest
        .spyOn(TruliooClient.prototype, "registerEvents")
        .mockReturnValueOnce();
      jest.spyOn(TruliooClient.prototype, "loadEmbedID").mockReturnValueOnce();
      jest.spyOn(TruliooClient.prototype, "init").mockReturnValueOnce();
      const truliooClient = new TruliooClient({ publicKey });
      try {
        await truliooClient.init();
        expect(truliooClient.injectAccessToken).toBeCalledTimes(1);
        expect(truliooClient.registerEvents).toBeCalledTimes(1);
        expect(truliooClient.loadEmbedID).toBeCalledTimes(1);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith(
          "something went wrong during EmbedID form initialization",
          error
        );
      }
    });
  });

  describe("InjectAccessToken", () => {
    it("should fetch accessToken", async () => {
      const accessToken = factory.random.string();
      const response = {
        json: jest.fn().mockReturnValueOnce({
          status: 200,
          accessToken: accessToken
        })
      };
      window.fetch = jest.fn().mockResolvedValueOnce(response);
      jest.spyOn(TruliooClient.prototype, "init").mockReturnValueOnce();

      const truliooClient = new TruliooClient({ publicKey, accessTokenURL });
      try {
        await truliooClient.injectAccessToken();
        expect(
          window.fetch
        ).toBeCalledWith(
          `${accessTokenURL}/trulioo-api/embedids/tokens/${publicKey}`,
          { method: "POST" }
        );

        expect(response.json).toBeCalledTimes(1);
        expect(truliooClient.accessToken).toBe(accessToken);
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith(
          "Something went wrong during access token generation",
          error
        );
      }
    });
  });

  describe("LoadEmbedID", () => {
    it("should load iframe", () => {
      jest.spyOn(TruliooClient.prototype, "init").mockReturnValueOnce();
      document.body.innerHTML = `<div id="trulioo-embedid"></div>`;
      const truliooClient = new TruliooClient({ publicKey, embedIDURL });

      truliooClient.loadEmbedID();

      expect(document.getElementById("embedid-module").src).toMatch(embedIDURL);
    });
  });
});
