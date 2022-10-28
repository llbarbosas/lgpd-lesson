import { Router as ExpressRouter } from "express";
import { controllerAdapter } from "./adapters";

export class Router {
  constructor(private controllers: Object[]) {}

  get expressRouter(): ExpressRouter {
    const router = ExpressRouter();

    this.controllers.forEach((controller) => {
      router.use(controllerAdapter(controller));
    });

    return router;
  }
}
