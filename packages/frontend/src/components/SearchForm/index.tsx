import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { getTags } from '../../api-types';
import { useArrayParam, useStringParam } from '../../hooks/useParam';
import DatetimeForm from '../DatetimeForm';
import TagsInput from '../TagsInput';

export default function SearchForm() {
  const [tags, setTags] = useArrayParam('t');
  const [beforeString, setBeforeString] = useStringParam('b');
  const [afterString, setAfterString] = useStringParam('a');

  const beforeDate = beforeString ? new Date(beforeString) : undefined;
  const afterDate = afterString ? new Date(afterString) : undefined;

  const { data: suggestedTags } = useQuery(
    ['tags', tags],
    async () => {
      const response = await getTags({ queryParams: { excludeTags: tags } });
      return response.tags;
    },
    { keepPreviousData: true },
  );

  const onTagsChange = useCallback(
    (newTags: string[]) => {
      const sorted = [...newTags].sort();
      setTags(sorted);
    },
    [setTags],
  );
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
    <form>
      <div>
        <h4>Tags</h4>
        <TagsInput value={tags} onChange={onTagsChange} id="tags" name="tags" suggestions={suggestedTags} />
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
    </form>
  );
}
