import { Router } from "./router";
import express, { Express } from "express";
import cors from "cors";
import { join } from "path";

export class App {
  private expressApp: Express;

  constructor(private router: Router, private publicFolderPath?: string) {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (this.publicFolderPath) {
      app.use(express.static(this.publicFolderPath));
    }

    app.use("/v1", this.router.expressRouter);

    this.expressApp = app;
  }

  listen(address: string) {
    this.expressApp.listen(address, () =>
      console.log(`Server listening on ${address}`)
    );
  }
}
