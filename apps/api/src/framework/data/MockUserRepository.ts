import { notOk, ok, Result, User } from "@lgpd-lesson/shared";
import { fixtures } from "../../config";
import { UserRepository } from "../../core";

export class MockUserRepository implements UserRepository {
  constructor(private repositoryData = fixtures.userRepositoryData) {}

  async getOne(query: {
    id?: string | undefined;
    email?: string | undefined;
    username?: string | undefined;
  }): Promise<Result<User, Error>> {
    let user: User | undefined;

    if (query.id) {
      user = this.repositoryData[query.id];
    } else {
      user = Object.values(this.repositoryData).find(
        (u) => u.email === query.email || u.username === query.username
      );
    }

    if (user === undefined) {
      return notOk(new Error("User not found"));
    }

    return ok(user);
  }
}
