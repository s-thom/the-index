import React, { useState } from "react";
import "./index.css";
import { RouteComponentProps } from "@reach/router";
import LoginUserForm from "../LoginUserForm";
import { useRequester } from "../../hooks/requests";
import { useToken } from "../../hooks/token";
import LoginTotpForm from "../LoginTotpForm";
import LoginTotpSetup from "../LoginTotpSetup";

export default function LoginPage({ navigate }: RouteComponentProps) {
  const requester = useRequester();
  const [, setToken] = useToken();
  const [showTotp, setShowTotp] = useState(false);
  const [name, setName] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpSetup, setTotpSetup] = useState();

  async function submitLogin(name: string, method?: string, code?: string) {
    const requestData: any = {
      name
    };

    if (method && code) {
      requestData.challenge = method;
      requestData.response = code;
    }

    const response = await requester.login(requestData);

    if ((response as any).token) {
      setToken((response as any).token);

      if (navigate) {
        navigate("/");
      }

      return;
    }

    if ((response as any).requires === "challenge" && (response as any).totp) {
      setShowTotp(true);
      return;
    }

    if ((response as any).requires === "setup") {
      setTotpSetup(response);
      setShowTotp(true);
      return;
    }

    console.error("Unknown response", response);
  }

  async function onUserSubmit(name: string) {
    setName(name);

    submitLogin(name, totpCode ? "TOTP" : undefined, totpCode);
  }

  async function onTotpSubmit(code: string) {
    setTotpCode(code);

    if (name) {
      submitLogin(name, "TOTP", code);
    }
  }

  return (
    <div className="LoginPage">
      <h2 className="LoginPage-heading">Login</h2>
      <LoginUserForm onSubmit={onUserSubmit} />
      {showTotp && <LoginTotpForm onSubmit={onTotpSubmit} />}
      {totpSetup && (
        <LoginTotpSetup code={totpSetup.code} url={totpSetup.url} />
      )}
    </div>
  );
}
