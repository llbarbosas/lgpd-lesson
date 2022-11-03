import { ViewBuilder } from "@lgpd-lesson/shared";

export interface AuthorizeStudentProfileAccessViewBuilder
  extends ViewBuilder<{
    userId: string;
    studentProfileId: string;
  }> {}
