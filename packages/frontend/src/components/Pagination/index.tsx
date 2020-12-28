import { Fragment, useMemo } from 'react';
import { noop } from '../../util/functions';
import TextButton from '../TextButton';
import { generateNumberRange } from './util';

interface PaginationProps {
  page: number;
  numPages: number;
  onPageSelect?: (newPage: number) => void;
  numPagesToDisplay?: number;
  className?: string;
}

export default function Pagination({
  page,
  numPages,
  onPageSelect = noop,
  numPagesToDisplay = 5,
  className,
}: PaginationProps) {
  const canGoBack = page > 1;
  const canGoForwards = page < numPages;

  const pageRange = useMemo(() => {
    return generateNumberRange(page, 1, numPages, numPagesToDisplay);
  }, [numPages, numPagesToDisplay, page]);

  return (
    <div className={className}>
      <TextButton disabled={!canGoBack} title="First" onClick={() => onPageSelect(1)}>
        &lt;&lt;
      </TextButton>
      &nbsp;
      <TextButton disabled={!canGoBack} title="Previous" onClick={() => onPageSelect(page - 1)}>
        &lt;
      </TextButton>
      &nbsp;
      {pageRange.map((pageNumber) => (
        <Fragment key={pageNumber}>
          <TextButton title={pageNumber.toString(10)} onClick={() => onPageSelect(pageNumber)}>
            {pageNumber}
          </TextButton>
          &nbsp;
        </Fragment>
      ))}
      <TextButton disabled={!canGoForwards} title="Next" onClick={() => onPageSelect(page + 1)}>
        &gt;
      </TextButton>
      &nbsp;
      <TextButton disabled={!canGoForwards} title="Last" onClick={() => onPageSelect(numPages)}>
        &gt;&gt;
      </TextButton>
    </div>
  );
}
