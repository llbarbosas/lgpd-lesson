import { Router } from "./router";
import express, { Express } from "express";
import cors from "cors";
import { join } from "path";

export class App {
  private expressApp: Express;

  constructor(private router: Router) {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(join(__dirname, "public")));

    app.use("/v1", this.router.expressRouter);

    this.expressApp = app;
  }

  listen(address: string) {
    this.expressApp.listen(address, () =>
      console.log(`Server listening on ${address}`)
    );
  }
}
