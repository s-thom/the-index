import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getV2LinkId } from '../../api-types';
import LinkItem from '../../components/LinkItem';

const StyledErrorContainer = styled.div`
  text-align: center;
`;

const StyledErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
`;

interface LinkDetailPagePath {
  id: string;
}

export default function LinkDetailPage() {
  const { id } = useParams<LinkDetailPagePath>();

  const { data, error } = useQuery(['link', id], async () => {
    const response = await getV2LinkId({ id });
    return response.link;
  });

  const errorSection = error && (
    <StyledErrorContainer>
      <StyledErrorText>
        There was an error while creating your new link. There&apos;s not much you can do, really.
      </StyledErrorText>
    </StyledErrorContainer>
  );

  const detailSection = data && (
    <div>
      <LinkItem link={data} />
    </div>
  );

  return (
    <div>
      {errorSection}
      {detailSection}
    </div>
  );
}
