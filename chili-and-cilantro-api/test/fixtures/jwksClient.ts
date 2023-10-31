import { SigningKey } from "jwks-rsa";

export class MockJwksClient {
  getSigningKey(
    kid: string,
    callback: (err: Error | null, key?: SigningKey) => void
  ) {
    callback(null, {
      kid: kid,
      alg: "RS256",
      getPublicKey() {
        return "public key";
      },
      publicKey: "public key",
    });
  }
}
