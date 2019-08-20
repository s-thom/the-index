import React, { useState } from "react";
import "./index.css";
import { RouteComponentProps, navigate } from "@reach/router";
import NewLinkForm from "../NewLinkForm";
import { addNewLink } from "../../requests";
import TextButton from "../TextButton";

interface NewLinkPageProps extends RouteComponentProps {}

export default function NewLinkPage(props: NewLinkPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);

  async function onFormSubmit(url: string, tags: string[]) {
    setSubmitting(true);

    try {
      const newLinkId = await addNewLink(url, tags);
      navigate(`/links/${newLinkId}`);

      setSubmitting(false);
    } catch (err) {
      console.error("[NewLinkPage submit]", err);
      setSubmitError(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="NewLinkPage">
      <h2 className="NewLinkPage-heading">New Link</h2>
      {submitError && (
        <div className="NewLinkPage-error">
          <p className="NewLinkPage-error-text">
            There was an error while creating you new link. There's not much you
            can do, really.
          </p>
          <TextButton type="button">Re-enable form</TextButton>
        </div>
      )}
      <NewLinkForm onSubmit={onFormSubmit} disabled={submitting} />
    </div>
  );
}
