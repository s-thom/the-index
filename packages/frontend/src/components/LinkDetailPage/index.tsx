import { RouteComponentProps } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { LinkDetail } from '../../api-types';
import { useRequester } from '../../hooks/requests';
import LinkItem from '../LinkItem';
import './index.css';

interface LinkDetailPagePath {
  id: string;
}

interface LinkDetailPageProps extends RouteComponentProps<LinkDetailPagePath> {}

export default function LinkDetailPage({ id }: LinkDetailPageProps) {
  const [detail, setDetail] = useState<LinkDetail | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const requester = useRequester();

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
        const link = await requester.getLinkById(trueId);
        setDetail(link);
      } catch (err) {
        //
      }
    }

    getDetail();
  }, [id, requester]);

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
