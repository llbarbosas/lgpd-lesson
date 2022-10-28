import { Client, User } from "@lgpd-lesson/shared";

export const webClient: Client = {
  id: "746f9e8e-433a-4df0-8776-765e1681f5d3",
  name: "@lgpd-lesson Public Web Client",
  // 123456
  secret:
    "7611d3d04e923e6264e295edb4a340ca:4c80655ded843d05255af3c2866c7597edc4b1488f96411181398d2203d75f0f92eb1c3b5baf9764493fa847f365099104dcdb43e642b04d5e0bcc36233a89ab",
  homePageUri: "http://localhost:3000",
  redirectUri: "http://localhost:8080/oauth/cb",
};

export const testUser: User = {
  id: "09d0e7a5-b93b-4421-b590-6841722e196b",
  username: "test.user",
  email: "test.user@ufms.br",
  // 123456
  password:
    "d8c9fb3408f391149d62cf7ff435fa61:691d59fed48635736fd9c4b39c9b66d31048d861737db083d7d72cdd8c34e1249b5591033f1ec0fe5c54842e5fe367b77bd16c4626a2d36952dcb0901503e255",
  publicKey:
    "-----BEGIN PUBLIC KEY-----\n" +
    "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxf/XTjFZJEx/kGQ3gqhT\n" +
    "ljlKbg74YP2C+tJoM2T6Hw0upqHTK/orcfsDx4QkBh8LPM4OhX0d8u/25+WzwHJS\n" +
    "KzUc0ubtF996UdWTJmlbq5PC7DrvXwIeDrfiKrO/AkwgE+OBTv/Q6EJIPUSKj/vw\n" +
    "eM73I0HijNMrzKM0fIQU11T3VZUO36inSDIKe23nSfIgTza557VmeZwFdJcRbOgM\n" +
    "NukVsTPPdtrU3jJ/x5EoScBqa1mHXsu1PqlmoSoU8aaKA+7zmDPaM5l5RKuKp9KQ\n" +
    "UiHwRrWRdRnh0EXj0jzG2Px/1POn0mr1yDTTGgdwvpMYtYYDkLFoHGLp0VlcBioj\n" +
    "3rwQL2a3NT7tZ9XCunBhqhlfoQ+Am4XVf07NGDwzBpOkVgu4UFHTA1nUX6pZ/vAn\n" +
    "QHOJf45j5JuXgpjQDJnHZeJ5sGaja6hjDUa/0l0wbA5k2vVQ8YUnQkIuOru7GTQ7\n" +
    "N0CRolWbHyiD7aXK3QRGZ9S1NLO97Jbxo7VtzinrPJHsI/NErus+ntcv8sGthozk\n" +
    "TCEWo7cDifHIzBnzOdaQCbQMPOnn+GNubmZbTaguhmHjYFMRlXWaP/b9btNUA9zZ\n" +
    "CZmXohiSgusyVp2vUyqzS0jbAr6GrnHXy0MkkhVucpRpIpruJNoVts5ubj3lvnmw\n" +
    "jomZX+00zBee8FQ2OJMHaHkCAwEAAQ==\n" +
    "-----END PUBLIC KEY-----\n",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\n" +
    "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\n" +
    "qZEi4iLZkpEt/lZ+PFBW1IkiOoO0gsGQWQ==\n" +
    "-----END PRIVATE KEY-----\n",
};

export const scopesClosureTree = [["admin", "admin"]];

export const webClientScopes: string[] = ["admin"];
export const testUserScopes: string[] = ["admin"];

export const clientRepositoryData = {
  [webClient.id]: webClient,
};

export const authorizationScopeRepositoryData = {
  scopesClosureTree,
  client: {
    [webClient.id]: webClientScopes,
  },
  user: {
    [testUser.id]: testUserScopes,
  },
};

export const optRequestRepositoryData = {};

export const userRepositoryData = {
  [testUser.id]: testUser,
};
