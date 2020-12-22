import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import urlRegex from 'url-regex-safe';
import { getTags } from '../../api-types';
import { noop } from '../../util/functions';
import TagsInput from '../TagsInput';
import TextButton from '../TextButton';

const FormWrapper = styled.form`
  margin: 0 0.5em;
`;

const FormUrlContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  font-size: 1.2em;
  margin-bottom: 0.5em;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
  }
`;

const FormUrlInput = styled.input`
  flex-grow: 1;
  font-size: 1em;
  margin-top: 0.5em;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-grow: 1;
    font-size: 1em;
    margin-top: 0;
    margin-right: 0.5em;
  }
`;

interface NewLinkFormValues {
  url: string;
  tags: string[];
}

interface NewLinkFormProps {
  onSubmit?: (url: string, tags: string[]) => void;
  disabled?: boolean;
  initialValues?: Partial<NewLinkFormValues>;
}

const URL_REGEX = urlRegex({ strict: true, exact: true });

const DEFAULT_VALUES: NewLinkFormValues = {
  url: '',
  tags: [],
};

export default function NewLinkForm({ onSubmit = noop, initialValues }: NewLinkFormProps) {
  const { control, handleSubmit, formState, watch, register } = useForm<NewLinkFormValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
    },
  });

  const { isValid, isSubmitting } = formState;
  function onFormSubmit(values: NewLinkFormValues) {
    return onSubmit(values.url, values.tags);
  }

  const tagsValue = watch('tags');
  const { data: suggestedTags } = useQuery(
    ['tags', tagsValue],
    async () => {
      const response = await getTags({ queryParams: { excludeTags: tagsValue } });
      return response.tags;
    },
    { keepPreviousData: true },
  );

  return (
    <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
      <FormUrlContainer>
        <FormUrlInput
          type="text"
          name="url"
          placeholder="Enter URL"
          aria-label="Enter URL"
          ref={register({ pattern: URL_REGEX, required: true })}
        />
        <TextButton type="submit" disabled={!isValid || isSubmitting}>
          Add
        </TextButton>
      </FormUrlContainer>
      <Controller
        control={control}
        name="tags"
        render={(props) => (
          <TagsInput value={props.value} onChange={props.onChange} id="tags" name="tags" suggestions={suggestedTags} />
        )}
      />
    </FormWrapper>
  );
}
