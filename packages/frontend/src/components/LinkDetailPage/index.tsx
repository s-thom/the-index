import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLinksId, LinkDetail } from '../../api-types';
import LinkItem from '../LinkItem';
import './index.css';

interface LinkDetailPagePath {
  id: string;
}

export default function LinkDetailPage() {
  const { id } = useParams<LinkDetailPagePath>();
  const [detail, setDetail] = useState<LinkDetail | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function getDetail() {
      const trueId = (id || '').toString();
      if (!trueId) {
        setDetail(undefined);
        setError(new Error('No ID was passed'));
        return;
      }
      setDetail(undefined);

      try {
        const response = await getLinksId({ id: trueId });
        setDetail(response.link);
      } catch (err) {
        //
      }
    }

    getDetail();
  }, [id]);

  const errorSection = error && (
    <div className="LinkDetailPage-error">
      <p className="LinkDetailPage-error-text">
        There was an error while creating your new link. There&apos;s not much you can do, really.
      </p>
    </div>
  );

  const detailSection = detail && (
    <div className="LinkDetailPage-link">
      <LinkItem link={detail} />
    </div>
  );

  return (
    <div className="LinkDetailPage">
      {errorSection}
      {detailSection}
    </div>
  );
}
