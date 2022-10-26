import { Result, ok } from "@lgpd-lesson/shared";
import { Mailer } from "src/core";

export class MockMailer implements Mailer {
  async sendMail(data: {
    to: string;
    subject: string;
    body: string;
  }): Promise<Result<true, Error>> {
    console.info("[MockMailer] sendMail:", data);
    return ok(true as const);
  }
}
