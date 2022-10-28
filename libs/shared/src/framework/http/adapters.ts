import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
  Handler as ExpressHandler,
} from "express";
import { PartialRecord } from "../../core";
import {
  Request as DomainRequest,
  Handler as DomainHandler,
  Method,
  getControllerMetadata,
} from "../../application";

export const requestAdapter = (request: ExpressRequest): DomainRequest => ({
  headers: request.headers,
  params: request.params,
  query: request.query as PartialRecord<string, string | string[]>,
  body: request.body,
});

export const handlerAdapter =
  (handler: DomainHandler): ExpressHandler =>
  async (req: ExpressRequest, res: ExpressResponse) => {
    const domainResponse = await handler(requestAdapter(req));

    const { headers, status, body } = domainResponse;

    Object.entries(headers ?? {}).forEach(([header, value]) =>
      res.setHeader(header, value)
    );

    return res.status(status).send(body);
  };

export const controllerAdapter = (controller: Object): Router => {
  const router = Router();

  const controllerMetadata = getControllerMetadata(controller);

  controllerMetadata.handlers.forEach(({ method, path, handler }) =>
    router[method.toLowerCase() as Lowercase<Method>](
      path,
      handlerAdapter(handler(controller))
    )
  );

  return Router().use(controllerMetadata.path, router);
};
