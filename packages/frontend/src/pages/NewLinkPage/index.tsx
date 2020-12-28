import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { postV2Links, PostV2LinksRequestBody, PostV2LinksResponse } from '../../api-types';
import NewLinkForm from '../../components/NewLinkForm';

const StyledHeading = styled.h2`
  text-align: center;
`;

export default function NewLinkPage() {
  const history = useHistory();

  const onSuccessCallback = useCallback(
    (response: PostV2LinksResponse) => {
      history.push(`/links/${response.link.id}`);
    },
    [history],
  );

  const { mutate } = useMutation<PostV2LinksResponse, void, PostV2LinksRequestBody>(
    ['links.create'],
    async (body) => {
      const response = await postV2Links({ body });
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
