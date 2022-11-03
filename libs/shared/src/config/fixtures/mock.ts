import * as authentication from "../authentication";
import { Client, ScopeId, ScopeInfo, User } from "../../core";
import { NodeCryptoFunctions, ScryptPasswordHasher } from "../../framework";

const passwordHasher = new ScryptPasswordHasher(authentication.hash_keylen);

const siscadWebClientPlainSecret = "123456";
const siscadWebClientSecret = passwordHasher
  .hash(siscadWebClientPlainSecret)
  .expect("siscadWebClientSecret creation failed");

export const siscadWebClient: Client = {
  id: "746f9e8e-433a-4df0-8776-765e1681f5d3",
  name: "SISCAD Web",
  homePageUri: "http://localhost:8080",
  secret: siscadWebClientSecret,
  redirectUri: "http://localhost:8080/oauth/cb",
};

const testUserPlainPassword = "123456";
const testUserPassword = passwordHasher
  .hash(testUserPlainPassword)
  .expect("testUser.password creation failed");

const cryptoFunctions = new NodeCryptoFunctions();

const { privateKey: testUserPlainPrivateKey, publicKey: testUserPublicKey } =
  cryptoFunctions
    .generateAsymmetricKeys()
    .expect("generateAsymmetricKeys failed");

const testUserPrivateKey = cryptoFunctions
  .encryptSymmetric(
    testUserPlainPrivateKey,
    cryptoFunctions
      .createSha256Hash(testUserPlainPassword)
      .expect("testUserPlainPassword createSha256Hash failed")
  )
  .expect("testUserPrivateKey creation failed");

export const testUser: User = {
  id: "09d0e7a5-b93b-4421-b590-6841722e196b",
  fullname: "Test User",
  cpf: "111.111.111-11",
  rga: "2022.1111.111-1",
  username: "test.user",
  email: "test.usertwo@ufms.br",
  password: testUserPassword,
  publicKey: testUserPublicKey,
  privateKey: testUserPrivateKey,
};

const testUser2PlainPassword = "78910";
const testUser2Password = passwordHasher
  .hash(testUser2PlainPassword)
  .expect("testUser.password creation failed");

const { privateKey: testUser2PlainPrivateKey, publicKey: testUser2PublicKey } =
  cryptoFunctions
    .generateAsymmetricKeys()
    .expect("generateAsymmetricKeys failed");

const testUser2PrivateKey = cryptoFunctions
  .encryptSymmetric(
    testUser2PlainPrivateKey,
    cryptoFunctions
      .createSha256Hash(testUser2PlainPassword)
      .expect("testUser2PlainPassword createSha256Hash failed")
  )
  .expect("testUserPrivateKey creation failed");

export const testUser2: User = {
  id: "b2991343-76ea-4eef-9c02-4247826d3fdb",
  fullname: "Test User 2",
  cpf: "222.222.222-22",
  rga: "2022.1111.111-2",
  username: "test.usertwo",
  email: "test.user@ufms.br",
  password: testUser2Password,
  publicKey: testUser2PublicKey,
  privateKey: testUser2PrivateKey,
};

export const passportScope: ScopeInfo = {
  id: "passport",
  authorizationRequestTitle: "Seu passaporte UFMS",
  authorizationRequestDescription: "Nome de usuário e e-mail institucional",
  authorizationRequestIcon: "bi-file-person-fill",
};

export const studentScope: ScopeInfo = {
  id: "student",
  authorizationRequestTitle: "Seu cadastro estudantil",
  authorizationRequestDescription: "Nome completo, CPF, RGA e curso",
  authorizationRequestIcon: "bi-bank",
};

export const studentProfileScope: ScopeInfo = {
  id: "student.profile",
  authorizationRequestTitle: "Seu cadastro sociodemográfico",
  authorizationRequestDescription:
    "Dados sensíveis como origem racial ou étnica e informações financeiras",
  authorizationRequestIcon: "bi-person-lines-fill",
};

export const studentProfileShareScope: ScopeInfo = {
  id: "student.profile:share",
  authorizationRequestTitle: "Cadastros sociodemográficos compartilhados",
  authorizationRequestDescription:
    "Permite compartilhar e/ou visualizar cadastros sociodemográficos compartilhados com você",
  authorizationRequestIcon: "bi-share-fill",
};

export const scopes = {
  [passportScope.id]: passportScope,
  [studentScope.id]: studentScope,
  [studentProfileScope.id]: studentProfileScope,
  [studentProfileShareScope.id]: studentProfileShareScope,
};

export type ScopeClosureTree = [ancestor: ScopeId, descendant: ScopeId][];

export const scopeClosureTree: ScopeClosureTree = [
  [passportScope.id, passportScope.id],
  [studentScope.id, studentScope.id],
  [studentProfileScope.id, studentProfileScope.id],
  [studentProfileScope.id, studentScope.id],
  [studentProfileShareScope.id, studentProfileShareScope.id],
  [studentProfileShareScope.id, studentProfileScope.id],
  [studentProfileShareScope.id, studentScope.id],
];

export const siscadWebClientScopes: ScopeId[] = [
  studentProfileShareScope.id,
  passportScope.id,
];
export const testUserScopes: ScopeId[] = [
  studentProfileShareScope.id,
  passportScope.id,
];
export const testUser2Scopes: ScopeId[] = [
  studentProfileShareScope.id,
  passportScope.id,
];

export const clientRepositoryData = {
  [siscadWebClient.id]: siscadWebClient,
};

export const authorizationScopeRepositoryData = {
  scopeClosureTree,
  scope: scopes,
  client: {
    [siscadWebClient.id]: siscadWebClientScopes,
  },
  user: {
    [testUser.id]: testUserScopes,
    [testUser2.id]: testUser2Scopes,
  },
};

export const otpRequestRepositoryData = {};

export const userRepositoryData = {
  [testUser.id]: testUser,
  [testUser2.id]: testUser2,
};
