import { AuthorizeStudentProfileAccessViewBuilder } from "@application/views";
import { join } from "path";
import { MustacheViewBuilder } from "@lgpd-lesson/shared";

export class HtmlAuthorizeStudentProfileAccessViewBuilder
  extends MustacheViewBuilder<{}>
  implements AuthorizeStudentProfileAccessViewBuilder
{
  constructor() {
    super(join(__dirname, "authorize_student_profile_access.html"));
  }
}
