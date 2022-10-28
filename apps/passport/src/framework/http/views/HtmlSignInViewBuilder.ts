import { SignInViewBuilder } from "@application/views";
import { join } from "path";
import { MustacheViewBuilder } from "@lgpd-lesson/shared";

export class HtmlSignInViewBuilder
  extends MustacheViewBuilder<{}>
  implements SignInViewBuilder
{
  constructor() {
    super(join(__dirname, "signin.html"));
  }
}
