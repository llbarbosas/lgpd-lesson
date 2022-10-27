import { ViewBuilder } from "./ViewBuilder";

export interface SignInViewBuilder
  extends ViewBuilder<{
    signInRequestId: string;
  }> {}
