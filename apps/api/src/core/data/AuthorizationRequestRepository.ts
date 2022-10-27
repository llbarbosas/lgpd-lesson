import { Result } from "@lgpd-lesson/shared";
import { AuthorizationRequest } from "@core/entities";

export interface AuthorizationRequestRepository {
  createOne(
    data: Omit<AuthorizationRequest, "id">
  ): Promise<Result<AuthorizationRequest>>;
  updateOne(
    query: Pick<Partial<AuthorizationRequest>, "code" | "id">,
    data: Partial<AuthorizationRequest>
  ): Promise<Result<AuthorizationRequest>>;
  getOne(
    query: Pick<Partial<AuthorizationRequest>, "code" | "id">
  ): Promise<Result<AuthorizationRequest>>;
}
