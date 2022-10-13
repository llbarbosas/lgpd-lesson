import { Result } from "@lgpd-lesson/shared";

export interface OTPRequestRepository {
  getOne(query: { otp: string; email: string }): Promise<Result<{}>>;
  deleteOne(query: { otp: string }): Promise<Result<{}>>;
}
