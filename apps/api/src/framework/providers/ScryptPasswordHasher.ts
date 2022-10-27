import { fromThrowable, Result } from "@lgpd-lesson/shared";
import { PasswordHasher } from "@core";
import { scryptSync, randomBytes } from "crypto";
import { passwords } from "@config";

export class ScryptPasswordHasher implements PasswordHasher {
  constructor(private keylen = passwords.hash_keylen) {}

  hash(plainPassword: string): Result<string, Error> {
    const salt = randomBytes(16).toString("hex");

    return fromThrowable(() => {
      const derivedKey = scryptSync(plainPassword, salt, this.keylen);

      return `${salt}:${derivedKey.toString("hex")}`;
    });
  }

  compare(plainPassword: string, hash: string): Result<boolean, Error> {
    return fromThrowable(() => {
      const [salt, key] = hash.split(":");

      const derivedKey = scryptSync(plainPassword, salt, this.keylen);

      return key === derivedKey.toString("hex");
    });
  }
}
