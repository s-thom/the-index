import { useCallback } from 'react';
import { useArrayParam, useStringParam } from '../../hooks/useParam';
import DatetimeForm from '../DatetimeForm';
import TagsForm from '../TagsForm';

export default function SearchForm() {
  const [tags, setTags] = useArrayParam('t');
  const [beforeString, setBeforeString] = useStringParam('b');
  const [afterString, setAfterString] = useStringParam('a');

  const beforeDate = beforeString ? new Date(beforeString) : undefined;
  const afterDate = afterString ? new Date(afterString) : undefined;

  const onBeforeDateChange = useCallback(
    (newDate?: Date) => {
      setBeforeString(newDate && newDate.toISOString());
    },
    [setBeforeString],
  );

  const onAfterDateChange = useCallback(
    (newDate?: Date) => {
      setAfterString(newDate && newDate.toISOString());
    },
    [setAfterString],
  );

  return (
    <div>
      <div>
        <h4>Tags</h4>
        <TagsForm tags={tags} onTagsChange={setTags} />
      </div>
      <div>
        <div>
          <h4>Before</h4>
          <DatetimeForm date={beforeDate} onDateChange={onBeforeDateChange} />
        </div>
        <div>
          <h4>After</h4>
          <DatetimeForm date={afterDate} onDateChange={onAfterDateChange} />
        </div>
      </div>
    </div>
  );
}
