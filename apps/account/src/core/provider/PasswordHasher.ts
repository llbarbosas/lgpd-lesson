import { Result } from "@lgpd-lesson/shared";

export interface PasswordHasher {
  hash(plainPassword: string): Result<string>;
  compare(plainPassword: string, hash: string): Result<boolean>;
}
