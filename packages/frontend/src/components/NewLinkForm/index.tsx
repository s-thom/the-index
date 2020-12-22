import { Field, Form, Formik, FormikProps, FormikHelpers } from 'formik';
import { useCallback } from 'react';
import styled from 'styled-components';
import urlRegex from 'url-regex-safe';
import TagsForm from '../TagsForm';
import TextButton from '../TextButton';

const FormWrapper = styled(Form)`
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

const FormUrlInput = styled(Field)`
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

interface NewLinkFormProps {
  onSubmit?: (url: string, tags: string[]) => void;
  disabled?: boolean;
}

interface NewLinkFormValues {
  url: string;
  tags: string[];
  tag_input: string;
}

const URL_REGEX = urlRegex({ strict: true, exact: true });

function NewLinkFormInner({ values, setFieldValue, isSubmitting, isValid }: FormikProps<NewLinkFormValues>) {
  const tagsChangeCallback = useCallback(
    (newTags) => {
      setFieldValue('tags', newTags);
    },
    [setFieldValue],
  );

  return (
    <FormWrapper>
      <FormUrlContainer>
        <FormUrlInput
          type="text"
          name="url"
          placeholder="Enter URL"
          aria-label="Enter URL"
          pattern={URL_REGEX.source}
          required
        />
        <TextButton type="submit" disabled={!isValid || isSubmitting}>
          Add
        </TextButton>
      </FormUrlContainer>
      <TagsForm tags={values.tags} onTagsChange={tagsChangeCallback} />
    </FormWrapper>
  );
}

export default function NewLinkForm({ onSubmit }: NewLinkFormProps) {
  function onFormSubmit(values: NewLinkFormValues, actions: FormikHelpers<NewLinkFormValues>) {
    if (onSubmit) {
      onSubmit(values.url, values.tags);
    }

    actions.setSubmitting(false);
  }

  const initialValues: NewLinkFormValues = { url: '', tags: [], tag_input: '' };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmit}
      render={(formikProps) => <NewLinkFormInner {...formikProps} />}
    />
  );
}
