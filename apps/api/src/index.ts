import { HTTPServer } from "./framework/http";

(async () => {
  const httpServer = new HTTPServer();

  httpServer.listen();
})();
