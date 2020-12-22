import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { postLinks, PostLinksRequestBody, PostLinksResponse } from '../../api-types';
import NewLinkForm from '../../components/NewLinkForm';
import TextButton from '../../components/TextButton';

const StyledHeading = styled.h2`
  text-align: center;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
`;

const StyledErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
`;

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
    <div>
      <StyledHeading>New Link</StyledHeading>
      {submitError && (
        <StyledErrorContainer>
          <StyledErrorText>
            There was an error while creating your new link. There&apos;s not much you can do, really.
          </StyledErrorText>
          <TextButton type="button">Re-enable form</TextButton>
        </StyledErrorContainer>
      )}
      <NewLinkForm onSubmit={onFormSubmit} disabled={submitting} />
    </div>
  );
}
