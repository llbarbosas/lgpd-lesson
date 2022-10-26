import { OTP, Result, ok, notOk } from "@lgpd-lesson/shared";
import { OTPRequestRepository } from "../../core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export class MockOTPRequestRepository implements OTPRequestRepository {
  constructor(private repositoryData: Record<OTP["otp"], OTP> = {}) {}

  async createOne(data: { email: string }): Promise<Result<OTP, Error>> {
    while (true) {
      const otp = nanoid();

      if (this.repositoryData[otp] !== undefined) {
        continue;
      }

      const otpRequest = { otp, email: data.email };

      this.repositoryData[otp] = otpRequest;

      return ok(otpRequest);
    }
  }

  async getOne(query: Pick<OTP, "otp" | "email">): Promise<Result<OTP, Error>> {
    const otpRequest = this.repositoryData[query.otp];

    if (otpRequest === undefined) {
      return notOk(new Error("OTP request not found"));
    }

    return ok(otpRequest);
  }

  async deleteOne(query: { otp: string }): Promise<Result<OTP, Error>> {
    const otpRequest = this.repositoryData[query.otp];

    if (otpRequest === undefined) {
      return notOk(new Error("OTP request not found"));
    }

    delete this.repositoryData[query.otp];

    return ok(otpRequest);
  }
}
