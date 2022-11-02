import { useMemo } from "react";
import { useAccessTokenData } from "../../api/oauth_react";

export function StudentNavbarButton() {
  const { fullname } = useAccessTokenData();

  return (
    <div className="relative group select-none hover:bg-sky-600 h-fit px-6 py-4 flex items-center gap-2">
      {fullname} <i className="bi bi-person-fill"></i>
      <div className="hidden group-hover:flex justify-end absolute top-full left-0 w-full p-4 bg-white">
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  const onClick = useMemo(
    () => () => {
      window.localStorage.removeItem("access_token");
      window.location.href = "/login";
    },
    []
  );

  return (
    <button
      onClick={onClick}
      className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded"
    >
      Sair
    </button>
  );
}
