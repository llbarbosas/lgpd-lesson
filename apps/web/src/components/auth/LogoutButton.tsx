import { useMemo } from "react";

export function LogoutButton() {
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
