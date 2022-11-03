import { useEffect, useState } from "react";
import { getAccessTokenData } from "./oauth";

export const useAccessTokenData = () => {
  const [accessTokenData, setAccessTokenData] = useState({
    fullname: null,
    cpf: null,
  });

  useEffect(() => {
    const tokenData = getAccessTokenData();

    setAccessTokenData((data) => ({
      ...data,
      fullname: tokenData.fullname,
      cpf: tokenData.cpf,
    }));
  }, []);

  return accessTokenData;
};
