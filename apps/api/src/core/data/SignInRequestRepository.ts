import { Result } from "@lgpd-lesson/shared";
import { SignInRequest } from "@core/entities";

export interface SignInRequestRepository {
  createOne(data: Omit<SignInRequest, "id">): Promise<Result<SignInRequest>>;
  getOne(query: Pick<SignInRequest, "id">): Promise<Result<SignInRequest>>;
}
