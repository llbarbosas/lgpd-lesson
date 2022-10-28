import { useEffect, useState } from "react";

export function AuthGuard(props: { page: string; fallbackPage: string }) {
  useEffect(() => {
    const accessToken = window.localStorage.getItem("access_token");

    window.location.href =
      accessToken === null ? props.fallbackPage : props.page;
  }, []);

  return <div></div>;
}
