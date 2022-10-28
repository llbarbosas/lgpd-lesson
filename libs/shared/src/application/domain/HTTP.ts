import { PartialRecord, Result } from "../../core";
import {
  BadRequestError,
  HTTPError,
  InternalServerError,
  NotFoundError,
} from "./HTTP.errors";

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

  static html(body: string): Response {
    return new Response(200, body);
  }

  static ok(body: Response["body"]): Response {
    return new Response(200, body);
  }

  static created(body: Response["body"]): Response {
    return new Response(201, body);
  }

  static fromResult(result: Result<unknown>): Response {
    if (result.isNotOk()) {
      return Response.serverError(result.value.message);
    }

    return new Response(200, result.value);
  }

  static async fromResultP(
    result: Promise<Result<unknown>>
  ): Promise<Response> {
    return Response.fromResult(await result);
  }

  static fromError(error: HTTPError): Response {
    return new Response(error.status, {
      error: error.name,
      message: error.message,
      error_code: error.errorCode,
    });
  }

  static notFound(
    message: HTTPError["message"],
    errorCode?: HTTPError["errorCode"]
  ): Response {
    return Response.fromError(new NotFoundError(message, errorCode));
  }

  static badRequest(
    message: HTTPError["message"],
    errorCode?: HTTPError["errorCode"]
  ): Response {
    return Response.fromError(new BadRequestError(message, errorCode));
  }

  static serverError(
    message: HTTPError["message"],
    errorCode?: HTTPError["errorCode"]
  ): Response {
    return Response.fromError(new InternalServerError(message, errorCode));
  }
}
