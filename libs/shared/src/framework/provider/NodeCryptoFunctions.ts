import {
  fromThrowable,
  Result,
  AsymmetricKeyPair,
  CryptoFunctions,
} from "../../core";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  generateKeyPairSync,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
} from "crypto";
import { nanoid } from "nanoid";

const IV = Buffer.from("34bc9bd797622b63c23f66ee09587378", "hex");
const SYMMETRIC_ALGORITHM = "aes-256-ctr";

export class NodeCryptoFunctions implements CryptoFunctions {
  constructor(
    private iv = IV,
    private symmetricAlgorithm = SYMMETRIC_ALGORITHM,
    private randomCodeGenerator = nanoid
  ) {}

  generateRandomCode(size: number): Result<string, Error> {
    return fromThrowable(() => this.randomCodeGenerator(size));
  }

  generateRandomSymmetricKey(): Result<string, Error> {
    return fromThrowable(() => randomBytes(32).toString("hex"));
  }

  generateAsymmetricKeys(): Result<AsymmetricKeyPair, Error> {
    return fromThrowable(() =>
      generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      })
    );
  }

  encryptSymmetric(data: string, passwordHash: string): Result<string, Error> {
    return fromThrowable(() => {
      const passwordHashBuffer = Buffer.from(passwordHash, "hex");
      const cipher = createCipheriv(
        this.symmetricAlgorithm,
        passwordHashBuffer,
        this.iv
      );

      const encryptedData = Buffer.concat([
        cipher.update(data),
        cipher.final(),
      ]);

      return encryptedData.toString("base64");
    });
  }

  decryptSymmetric(data: string, passwordHash: string): Result<string, Error> {
    return fromThrowable(() => {
      const passwordHashBuffer = Buffer.from(passwordHash, "hex");

      const decipher = createDecipheriv(
        this.symmetricAlgorithm,
        passwordHashBuffer,
        this.iv
      );

      const dataBuffer = Buffer.from(data, "base64");

      const decryptedData = Buffer.concat([
        decipher.update(dataBuffer),
        decipher.final(),
      ]);

      return decryptedData.toString("utf-8");
    });
  }

  encryptAsymmetric(data: string, publicKey: string): Result<string, Error> {
    return fromThrowable(() => {
      const bufferedData = Buffer.from(data);

      const encryptedData = publicEncrypt(publicKey, bufferedData);

      return encryptedData.toString("hex");
    });
  }

  decryptAsymmetric(data: string, privateKey: string): Result<string, Error> {
    return fromThrowable(() => {
      const bufferedData = Buffer.from(data, "hex");

      const decryptedData = privateDecrypt(privateKey, bufferedData);

      return decryptedData.toString("utf-8");
    });
  }

  createSha256Hash(
    data: string,
    encoding: "base64url" | "hex" = "hex"
  ): Result<string, Error> {
    return fromThrowable(() =>
      createHash("sha256").update(data).digest(encoding)
    );
  }
}
