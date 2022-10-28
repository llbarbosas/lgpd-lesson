import { UseCase, Result, ok } from "@lgpd-lesson/shared";

type Properties = {};

export class RevokeToken implements UseCase<Properties, Promise<Result<{}>>> {
  constructor() {}

  async execute(props: Properties) {
    return ok({});
  }
}
