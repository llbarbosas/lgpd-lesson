import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/oauth";

export function AuthGuard(props: { page: string; fallbackPage: string }) {
  useEffect(() => {
    const accessToken = getAccessToken();

    window.location.href =
      accessToken === null ? props.fallbackPage : props.page;
  }, []);

  return <div></div>;
}
