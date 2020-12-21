import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postLinks } from '../../api-types';
import NewLinkForm from '../NewLinkForm';
import TextButton from '../TextButton';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NewLinkPage() {
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);

  async function onFormSubmit(url: string, tags: string[]) {
    setSubmitting(true);

    try {
      const response = await postLinks({ body: { url, tags } });
      history.push(`/links/${response.id}`);

      setSubmitting(false);
    } catch (err) {
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
