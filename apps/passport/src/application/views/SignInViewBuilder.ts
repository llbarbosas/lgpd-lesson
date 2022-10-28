import { ViewBuilder } from "@lgpd-lesson/shared";

export interface SignInViewBuilder
  extends ViewBuilder<{
    signInRequestId: string;
  }> {}
