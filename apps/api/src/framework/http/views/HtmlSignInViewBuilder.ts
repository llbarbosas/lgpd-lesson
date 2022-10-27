import { SignInViewBuilder } from "@application/views";
import { join } from "path";
import { MustacheViewBuilder } from "./MustacheViewBuilder";

export class HtmlSignInViewBuilder
  extends MustacheViewBuilder<{}>
  implements SignInViewBuilder
{
  constructor() {
    super(join(__dirname, "signin.html"));
  }
}
