import { useEffect, useState } from "react";
import { getTokenAuthorizationCode } from "../../api/oauth";

export function OAuthCallback() {
  const [oauthError, setOauthError] = useState<string>();

  useEffect(() => {
    const url = new URL(document.URL);

    const error = url.searchParams.get("error");

    if (!!error) {
      setOauthError(
        `Não foi possível obter a autorização. Código do erro: ${error}`
      );
      return;
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!state || !code) {
      setOauthError("Parâmetros inválidos");
      return;
    }

    const codeVerifier = window.localStorage.getItem(state);

    if (!codeVerifier) {
      setOauthError("Requisição inválida");
      return;
    }

    getTokenAuthorizationCode(code, codeVerifier).then(
      (accessTokenResponse) => {
        if (accessTokenResponse.error) {
          setOauthError(accessTokenResponse.message);
          return;
        }

        window.localStorage.setItem(
          "access_token",
          accessTokenResponse.access_token
        );

        window.location.href = "/";
      }
    );
  }, []);

  return (
    <>
      <header className="w-screen bg-[#313233] px-8 py-1 text-white text-sm font-light select-none">
        <span className="flex gap-2">
          <i className="bi bi-bank"></i> Universidade Exemplar de Mato Grosso do
          Sul
        </span>
      </header>
      <main className="min-h-screen w-screen login-background flex justify-center">
        <div className="flex flex-col items-center gap-10 p-10">
          <img
            className="w-[250px]"
            draggable="false"
            src="/siscad_logo.png"
            alt="siscad logo"
          />
          <div className="flex flex-col gap-4 bg-white rounded-md w-[400px] shadow-lg p-10">
            {oauthError && (
              <div className="bg-red-100 p-4 rounded-md flex gap-2">
                <i className="bi bi-info-circle-fill text-red-700"></i>
                {oauthError}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
