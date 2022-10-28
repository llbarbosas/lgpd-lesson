import { UseCase, Result, ok, OTP, notOk, Mailer } from "@lgpd-lesson/shared";
import { OTPRequestRepository } from "@core/data";

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
