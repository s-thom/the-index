import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { postLinks, PostLinksRequestBody, PostLinksResponse } from '../../api-types';
import NewLinkForm from '../NewLinkForm';
import TextButton from '../TextButton';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NewLinkPage() {
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | undefined>(undefined);

  const onSuccessCallback = useCallback(
    (response: PostLinksResponse) => {
      history.push(`/links/${response.id}`);
      setSubmitting(false);
    },
    [history],
  );
  const onErrorCallback = useCallback((error: unknown) => {
    setSubmitError(error as any);
    setSubmitting(false);
  }, []);

  const { mutate } = useMutation<PostLinksResponse, void, PostLinksRequestBody>(
    ['links.create'],
    async (body) => {
      const response = await postLinks({ body });
      return response;
    },
    {
      onSuccess: onSuccessCallback,
      onError: onErrorCallback,
    },
  );
  const onFormSubmit = useCallback(
    (url, tags) => {
      mutate({ url, tags });
    },
    [mutate],
  );

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
