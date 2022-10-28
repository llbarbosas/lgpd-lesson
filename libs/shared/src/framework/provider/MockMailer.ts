import { Mailer, Result, ok } from "../../core";

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
