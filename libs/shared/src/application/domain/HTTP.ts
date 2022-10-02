import { PartialRecord, KeysMatching } from "../../core";
import { HTTPError, InternalServerError, NotFoundError } from "./HTTP.errors";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export type Request = {
  headers: PartialRecord<string, string | string[]>;
  params: PartialRecord<string, string>;
  query: PartialRecord<string, string | string[]>;
  body: any;
};

export type Handler = (request: Request) => Promise<Response> | Response;

export class Response {
  constructor(
    public status: number,
    public body: any,
    public headers?: Record<string, string>
  ) {}

  static withHeaders(
    headers: Required<Response["headers"]>,
    response: Response
  ): Response {
    return new Response(response.status, response.body, headers);
  }

  static ok(body: Response["body"]): Response {
    return statusResponse(200, body);
  }

  static created(body: Response["body"]): Response {
    return statusResponse(201, body);
  }

  static notFound(
    message: HTTPError["message"],
    errorCode?: HTTPError["errorCode"]
  ): Response {
    return fromError(new NotFoundError(message, errorCode));
  }

  static serverError(
    message: HTTPError["message"],
    errorCode?: HTTPError["errorCode"]
  ): Response {
    return fromError(new InternalServerError(message, errorCode));
  }
}

const statusResponse = (status: Response["status"], body: Response["body"]) =>
  new Response(status, body);

const fromError = (error: HTTPError) =>
  statusResponse(error.status, {
    error: error.name,
    message: error.message,
    error_code: error.errorCode,
  });
