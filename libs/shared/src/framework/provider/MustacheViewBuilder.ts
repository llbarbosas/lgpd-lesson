import { ViewBuilder } from "../../core";
import { readFileSync } from "fs";
import mustache from "mustache";

export class MustacheViewBuilder<T> implements ViewBuilder<T> {
  private htmlFile: string;

  constructor(filepath: string) {
    this.htmlFile = readFileSync(filepath).toString();
  }

  build(data: T): string {
    return mustache.render(this.htmlFile, data);
  }
}
