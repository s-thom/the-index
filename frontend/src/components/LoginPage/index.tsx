import React from "react";
import "./index.css";
import { RouteComponentProps } from "@reach/router";
import LoginUserForm from "../LoginUserForm";
import { useRequester } from "../../hooks/requests";
import { useToken } from "../../hooks/token";

export default function LoginPage({ navigate }: RouteComponentProps) {
  const requester = useRequester();
  const [, setToken] = useToken();

  async function onUserSubmit(name: string) {
    const token = await requester.login(name);
    if (token) {
      setToken(token);
    }

    if (navigate) {
      navigate("/");
    }
  }

  return (
    <div className="LoginPage">
      <h2 className="LoginPage-heading">Login</h2>
      <LoginUserForm onSubmit={onUserSubmit} />
    </div>
  );
}
