import { Router as ExpressRouter } from "express";
import { controllerAdapter } from "./adapters";

export class Router {
  constructor(
    private authController: Object,
    private studentController: Object
  ) {}

  get expressRouter(): ExpressRouter {
    const router = ExpressRouter();

    const controllers = [this.authController, this.studentController];

    controllers.forEach((controller) => {
      router.use(controllerAdapter(controller));
    });

    return router;
  }
}
