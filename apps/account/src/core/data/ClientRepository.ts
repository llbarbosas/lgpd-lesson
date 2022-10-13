import { Client, Result } from "@lgpd-lesson/shared";

export interface ClientRepository {
  getOne(query: { id: Client["id"] }): Promise<Result<Client>>;
}
