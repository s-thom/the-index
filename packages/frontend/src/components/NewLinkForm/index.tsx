import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import urlRegex from 'url-regex-safe';
import useSuggestedTags from '../../hooks/useSuggestedTags';
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

export interface NewLinkFormValues {
  url: string;
  tags: string[];
  isPublic: boolean;
}

interface NewLinkFormProps {
  onSubmit?: (values: NewLinkFormValues) => void;
  initialValues?: Partial<NewLinkFormValues>;
}

const URL_REGEX = urlRegex({ strict: true, exact: true });

const DEFAULT_VALUES: NewLinkFormValues = {
  url: '',
  tags: [],
  isPublic: false,
};

export default function NewLinkForm({ onSubmit = noop, initialValues }: NewLinkFormProps) {
  const { control, handleSubmit, formState, watch, register } = useForm<NewLinkFormValues>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
    },
    mode: 'onChange',
  });

  const { isValid, isSubmitting } = formState;
  const onFormSubmit = useCallback(
    ({ url, tags, isPublic }: NewLinkFormValues) => {
      return onSubmit({ url, tags, isPublic });
    },
    [onSubmit],
  );

  const tagsValue = watch('tags');
  const suggestedTags = useSuggestedTags(tagsValue);

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
          <TagsInput
            value={props.value}
            onChange={(newTags) => props.onChange([...newTags].sort())}
            id="tags"
            name="tags"
            suggestions={suggestedTags}
          />
        )}
      />
      <div>
        <input id="new-link.isPublic" type="checkbox" name="isPublic" ref={register} />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="new-link.isPublic">Allow other users to see this link in their search results</label>
      </div>
    </FormWrapper>
  );
}
