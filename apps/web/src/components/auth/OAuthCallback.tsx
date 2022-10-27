import { useEffect } from "react";
import { getTokenAuthorizationCode } from "../../api/oauth";

export function OAuthCallback() {
  useEffect(() => {
    const url = new URL(document.URL);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!state || !code) {
      return;
    }

    const codeVerifier = window.localStorage.getItem(state);

    if (!codeVerifier) {
      return;
    }

    getTokenAuthorizationCode(code, codeVerifier).then((accessToken) => {
      console.log(accessToken);
    });
  }, []);

  return <div>oauth callback</div>;
}
