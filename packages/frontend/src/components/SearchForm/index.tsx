import queryString from 'query-string';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getParamAsArray, getParamAsString } from '../../util/getParam';
import DatetimeForm from '../DatetimeForm';
import TagsForm from '../TagsForm';
import './index.css';

export default function SearchForm() {
  const history = useHistory();
  const location = useLocation();
  const tags = getParamAsArray('t');
  const beforeString = getParamAsString('b');
  const afterString = getParamAsString('a');

  const beforeDate = beforeString ? new Date(beforeString) : undefined;
  const afterDate = afterString ? new Date(afterString) : undefined;

  const setParam = useCallback(
    (key: string, value: string | string[] | null | undefined) => {
      const currentQuery = queryString.parse(location.search ?? '', {
        arrayFormat: 'comma',
      });

      currentQuery[key] = value ?? null;

      const query = queryString.stringify(currentQuery, {
        arrayFormat: 'comma',
      });
      history.push(`?${query}`);
    },
    [history, location.search],
  );

  const onTagsChange = useCallback(
    (newTags: string[]) => {
      setParam('t', newTags);
    },
    [setParam],
  );

  const onBeforeDateChange = useCallback(
    (newDate?: Date) => {
      setParam('b', newDate && newDate.toISOString());
    },
    [setParam],
  );

  const onAfterDateChange = useCallback(
    (newDate?: Date) => {
      setParam('a', newDate && newDate.toISOString());
    },
    [setParam],
  );

  return (
    <div className="SearchForm">
      <div className="SearchForm-tags">
        <h4 className="SearchForm-section-heading">Tags</h4>
        <TagsForm tags={tags} onTagsChange={onTagsChange} />
      </div>
      <div className="SearchForm-dates">
        <div className="SearchForm-dates-before">
          <h4 className="SearchForm-section-heading">Before</h4>
          <DatetimeForm date={beforeDate} onDateChange={onBeforeDateChange} />
        </div>
        <div className="SearchForm-dates-after">
          <h4 className="SearchForm-section-heading">After</h4>
          <DatetimeForm date={afterDate} onDateChange={onAfterDateChange} />
        </div>
      </div>
    </div>
  );
}
