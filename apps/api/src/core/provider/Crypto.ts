import { Result } from "@lgpd-lesson/shared";

export type AsymmetricKeyPair = { publicKey: string; privateKey: string };

export interface CryptoFunctions {
  generateRandomCode(size: number): Result<string>;

  generateRandomSymmetricKey(): Result<string>;
  generateAsymmetricKeys(): Result<AsymmetricKeyPair>;

  encryptSymmetric(data: string, passwordHash: string): Result<string>;
  decryptSymmetric(data: string, passwordHash: string): Result<string>;

  encryptAsymmetric(data: string, publicKey: string): Result<string>;
  decryptAsymmetric(data: string, privateKey: string): Result<string>;

  createSha256Hash(data: string): Result<string>;
}
