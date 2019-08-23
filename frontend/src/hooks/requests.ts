import { useState, useEffect } from "react";
import { useToken } from "./token";
import Requester from "../requests";

export function useRequester() {
  const [requester] = useState(new Requester());
  const [token, setToken] = useToken();

  useEffect(() => {
    requester.setToken(token, setToken);
  }, [requester, token, setToken]);

  return requester;
}
