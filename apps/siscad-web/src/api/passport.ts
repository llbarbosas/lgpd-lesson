const PASSPORT_API_URL = "http://localhost:3000/v1";

export const getAccessToken = ({
  clientId,
  code,
  codeVerifier,
}: {
  codeVerifier: string;
  code: string;
  clientId: string;
}): Promise<{
  access_token: string;
}> =>
  fetch(`${PASSPORT_API_URL}/auth/token`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      grant_type: "code",
      code,
      code_verifier: codeVerifier,
      client_id: clientId,
    }),
  }).then((response) => response.json());

export const getPassportInfo = ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string | null;
}): Promise<{
  id: string;
  username: string;
  email: string;
}> =>
  fetch(`${PASSPORT_API_URL}/passports/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json());
