import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useDeepMemo from '../../hooks/useDeepMemo';
import useSuggestedTags from '../../hooks/useSuggestedTags';
import { noop } from '../../util/functions';
import { PlainInput } from '../PlainComponents';
import TagsInput from '../TagsInput';

export interface SearchFormValues {
  tags: string[];
  before?: string;
  after?: string;
  includePublic?: boolean;
}

interface SearchFormProps {
  initialValues?: Partial<SearchFormValues>;
  onChange?: (values: SearchFormValues) => void;
}

const DEFAULT_VALUES: SearchFormValues = {
  tags: [],
  includePublic: false,
};

export default function SearchForm({ initialValues, onChange = noop }: SearchFormProps) {
  const { control, watch, register } = useForm<SearchFormValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
    },
  });

  const tagsValue = watch('tags');
  const suggestedTags = useSuggestedTags(tagsValue);

  const values = watch();
  const memoisedValues = useDeepMemo(values);
  useEffect(() => {
    onChange(memoisedValues);
  }, [onChange, memoisedValues]);

  return (
    <form>
      <div>
        <h4>Tags</h4>
        <Controller
          control={control}
          name="tags"
          render={(props) => (
            <TagsInput
              value={props.value}
              onChange={(newTags) => props.onChange([...newTags].sort())}
              id="tags"
              name="tags"
              suggestions={suggestedTags}
            />
          )}
        />
      </div>
      <div>
        <div>
          <h4>Before</h4>
          <PlainInput name="before" placeholder="Date" type="date" ref={register} />
        </div>
        <div>
          <h4>After</h4>
          <PlainInput name="after" placeholder="Date" type="date" ref={register} />
        </div>
        <div>
          <h4>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="search.includePublic">Include other users&apos; links</label>
            <input
              id="search.includePublic"
              name="includePublic"
              placeholder="Include other users' links"
              type="checkbox"
              ref={register}
            />
          </h4>
        </div>
      </div>
    </form>
  );
}
