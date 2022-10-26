import { OTP, Result } from "@lgpd-lesson/shared";

export interface OTPRequestRepository {
  createOne(data: { email: string }): Promise<Result<OTP>>;
  getOne(query: Pick<OTP, "email" | "otp">): Promise<Result<OTP>>;
  deleteOne(query: { otp: string }): Promise<Result<OTP>>;
}
