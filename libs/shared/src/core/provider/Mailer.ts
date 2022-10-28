import { Result } from "../domain";

export interface Mailer {
  sendMail(data: {
    to: string;
    subject: string;
    body: string;
  }): Promise<Result<true>>;
}
