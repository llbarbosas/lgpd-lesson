import jwtDecode from "jwt-decode";
import { nanoid } from "nanoid";
import * as passportApi from "./passport";

export const CLIENT_ID = "746f9e8e-433a-4df0-8776-765e1681f5d3";
export const CLIENT_REQUIRED_SCOPE = "passport student.profile:share";

export const getAccessToken = (): string | null =>
  window?.localStorage?.getItem("access_token");
export const setAccessToken = (accessToken: string) =>
  window?.localStorage?.setItem("access_token", accessToken);

export const parseAccessToken = (accessToken: string): any =>
  jwtDecode(accessToken);
export const getAccessTokenData = () =>
  parseAccessToken(getAccessToken() ?? "");

export const generateAuthorizationURL = async () => {
  const state = nanoid();
  const codeVerifier = nanoid();
  const codeChallenge = await sha256(codeVerifier);

  const url = new URL("http://localhost:3000/v1/auth/authorize");
  url.searchParams.append("client_id", CLIENT_ID);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("code_challenge_method", "S256");
  url.searchParams.append("code_challenge", codeChallenge);
  url.searchParams.append("scope", CLIENT_REQUIRED_SCOPE);
  url.searchParams.append("state", state);

  return { state, codeVerifier, url: url.toString() };
};

export const sha256 = async (value: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashString = String.fromCharCode(...new Uint8Array(hash));

  return base64Url(hashString);
};

const base64Url = (data: string): string =>
  window.btoa(data).replace(/\//g, "_").replace(/\+/g, "-").replace(/=$/g, "");

export const getTokenAuthorizationCode = async (
  code: string,
  codeVerifier: string
) =>
  passportApi.getAccessToken({
    code,
    codeVerifier,
    clientId: CLIENT_ID,
  });
