import { UseCase, Result, ok, OTP, notOk } from "@lgpd-lesson/shared";
import { OTPRequestRepository } from "src/core/data";
import { Mailer } from "src/core/provider";

type Properties = {
  email: OTP["email"];
};

export class RequestOTP implements UseCase<Properties, Promise<Result<true>>> {
  constructor(
    private otpRequestRepository: OTPRequestRepository,
    private mailer: Mailer
  ) {}

  async execute(props: Properties) {
    const otpRequestResult = await this.otpRequestRepository.createOne({
      email: props.email,
    });

    if (otpRequestResult.isNotOk()) {
      return notOk(otpRequestResult.value);
    }

    const sendMailResult = await this.mailer.sendMail({
      to: props.email,
      subject: "OTP request",
      body: `Your OTP is ${otpRequestResult.value.otp}`,
    });

    if (sendMailResult.isNotOk()) {
      return notOk(sendMailResult.value);
    }

    return ok(true as const);
  }
}
