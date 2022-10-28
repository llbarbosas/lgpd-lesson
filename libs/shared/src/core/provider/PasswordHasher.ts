import { Result } from "../domain";

export interface PasswordHasher {
  hash(plainPassword: string): Result<string>;
  compare(plainPassword: string, hash: string): Result<boolean>;
}
