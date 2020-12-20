import { navigate, RouteComponentProps } from '@reach/router';
import React, { useState } from 'react';
import { useRequester } from '../../hooks/requests';
import NewLinkForm from '../NewLinkForm';
import TextButton from '../TextButton';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NewLinkPage(props: RouteComponentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);
  const requester = useRequester();

  async function onFormSubmit(url: string, tags: string[]) {
    setSubmitting(true);

    try {
      const newLinkId = await requester.addNewLink(url, tags);
      navigate(`/links/${newLinkId}`);

      setSubmitting(false);
    } catch (err) {
      console.error('[NewLinkPage submit]', err);
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
            There was an error while creating your new link. There&apos;s not much you can do, really.
          </p>
          <TextButton type="button">Re-enable form</TextButton>
        </div>
      )}
      <NewLinkForm onSubmit={onFormSubmit} disabled={submitting} />
    </div>
  );
}