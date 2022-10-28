import { useEffect } from "react";
import { generateAuthorizationURL } from "../../api/oauth";

export function PassportAuth() {
  useEffect(() => {
    generateAuthorizationURL().then(({ url, state, codeVerifier }) => {
      window.localStorage.setItem(state, codeVerifier);

      window.location.href = url;
    });
  }, []);

  return <div>PassportLogin</div>;
}
