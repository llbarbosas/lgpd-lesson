import { Result } from "../domain";
import { User } from "../entity";

export interface UserRepository {
  getOne(query: {
    id?: User["id"];
    email?: User["email"];
    username?: User["username"];
  }): Promise<Result<User>>;
}
