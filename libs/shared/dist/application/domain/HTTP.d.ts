import { PartialRecord, Result } from "../../core";
import { HTTPError } from "./HTTP.errors";
export declare type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
export declare type Request = {
    headers: PartialRecord<string, string | string[]>;
    params: PartialRecord<string, string>;
    query: PartialRecord<string, string | string[]>;
    body: any;
};
export declare type Handler = (request: Request) => Promise<Response> | Response;
export declare class Response {
    status: number;
    body: any;
    headers?: Record<string, string> | undefined;
    constructor(status: number, body: any, headers?: Record<string, string> | undefined);
    static withHeaders(headers: Required<Response["headers"]>, response: Response): Response;
    static ok(body: Response["body"]): Response;
    static created(body: Response["body"]): Response;
    static fromResult(result: Result<unknown>): Response;
    static fromResultP(result: Promise<Result<unknown>>): Promise<Response>;
    static fromError(error: HTTPError): Response;
    static notFound(message: HTTPError["message"], errorCode?: HTTPError["errorCode"]): Response;
    static serverError(message: HTTPError["message"], errorCode?: HTTPError["errorCode"]): Response;
}
