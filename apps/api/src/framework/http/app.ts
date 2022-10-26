import { Router } from "./router";
import express, { Express } from "express";

export class App {
  private expressApp: Express;

  constructor(private router: Router) {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/v1", this.router.expressRouter);

    this.expressApp = app;
  }

  listen(address: string) {
    this.expressApp.listen(address, () =>
      console.log(`Server listening on ${address}`)
    );
  }
}
