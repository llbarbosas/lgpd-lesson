import { User, Result } from "@lgpd-lesson/shared";

export interface UserRepository {
  getOne(where: {
    id?: User["id"];
    email?: User["email"];
    username?: User["username"];
  }): Promise<Result<User>>;
}
