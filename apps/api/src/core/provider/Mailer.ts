import { Result } from "@lgpd-lesson/shared";

export interface Mailer {
  sendMail(data: {
    to: string;
    subject: string;
    body: string;
  }): Promise<Result<true>>;
}
