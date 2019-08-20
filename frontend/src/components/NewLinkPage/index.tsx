import React, { useState } from "react";
import "./index.css";
import { RouteComponentProps } from "@reach/router";
import NewLinkForm from "../NewLinkForm";

interface NewLinkPageProps extends RouteComponentProps {}

export default function NewLinkPage(props: NewLinkPageProps) {
  const [submitting, setSubmitting] = useState(false);

  function onFormSubmit(url: string, tags: string[]) {
    console.log("form submitted", url, tags);
    setSubmitting(true);
  }

  return (
    <div className="NewLinkPage">
      <h2 className="NewLinkPage-heading">New Link</h2>
      <NewLinkForm onSubmit={onFormSubmit} disabled={submitting} />
    </div>
  );
}
