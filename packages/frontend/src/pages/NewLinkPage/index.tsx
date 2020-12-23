import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { postLinks, PostLinksRequestBody, PostLinksResponse } from '../../api-types';
import NewLinkForm from '../../components/NewLinkForm';

const StyledHeading = styled.h2`
  text-align: center;
`;

export default function NewLinkPage() {
  const history = useHistory();

  const onSuccessCallback = useCallback(
    (response: PostLinksResponse) => {
      history.push(`/links/${response.id}`);
    },
    [history],
  );

  const { mutate } = useMutation<PostLinksResponse, void, PostLinksRequestBody>(
    ['links.create'],
    async (body) => {
      const response = await postLinks({ body });
      return response;
    },
    {
      onSuccess: onSuccessCallback,
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
      <NewLinkForm onSubmit={onFormSubmit} />
    </div>
  );
}
