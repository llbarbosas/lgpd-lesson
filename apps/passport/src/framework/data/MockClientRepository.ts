import { Result, Client, notOk, ok, fixtures } from "@lgpd-lesson/shared";
import { ClientRepository } from "@core";

export class MockClientRepository implements ClientRepository {
  constructor(private repositoryData = fixtures.clientRepositoryData) {}

  async getOne(query: { id: string }): Promise<Result<Client, Error>> {
    const client = this.repositoryData[query.id];

    if (client === undefined) {
      return notOk(new Error("Client not found"));
    }

    return ok(client);
  }
}
