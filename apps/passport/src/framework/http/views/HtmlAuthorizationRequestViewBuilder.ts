import { AuthorizationRequestViewBuilder } from "@application/views";
import { AuthorizationRequestViewParams } from "@core";
import { join } from "path";
import { MustacheViewBuilder } from "@lgpd-lesson/shared";

export class HtmlAuthorizationRequestViewBuilder
  extends MustacheViewBuilder<AuthorizationRequestViewParams>
  implements AuthorizationRequestViewBuilder
{
  constructor() {
    super(join(__dirname, "authorization_request.html"));
  }
}
