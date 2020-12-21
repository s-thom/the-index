import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getLinksId } from '../../api-types';
import LinkItem from '../LinkItem';
import './index.css';

interface LinkDetailPagePath {
  id: string;
}

export default function LinkDetailPage() {
  const { id } = useParams<LinkDetailPagePath>();

  const { data, error } = useQuery(['link', id], async () => {
    const response = await getLinksId({ id });
    return response.link;
  });

  const errorSection = error && (
    <div className="LinkDetailPage-error">
      <p className="LinkDetailPage-error-text">
        There was an error while creating your new link. There&apos;s not much you can do, really.
      </p>
    </div>
  );

  const detailSection = data && (
    <div className="LinkDetailPage-link">
      <LinkItem link={data} />
    </div>
  );

  return (
    <div className="LinkDetailPage">
      {errorSection}
      {detailSection}
    </div>
  );
}
