import { useAccessTokenData } from "../../api/oauth_react";

export function StudentInfo() {
  const { fullname, cpf } = useAccessTokenData();

  return (
    <div>
      <p>
        <b>Nome:</b> {fullname}
      </p>
      <p>
        <b>CPF:</b> {cpf}
      </p>
    </div>
  );
}
