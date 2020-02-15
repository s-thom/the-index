import { Field, Form, Formik, FormikActions, FormikProps } from "formik";
import React, { useCallback } from "react";
import urlRegex from "url-regex";
import TagsForm from "../TagsForm";
import TextButton from "../TextButton";
import "./index.css";

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

function NewLinkFormInner({
  values,
  setFieldValue,
  isSubmitting,
  isValid
}: FormikProps<NewLinkFormValues>) {
  const tagsChangeCallback = useCallback(
    newTags => {
      setFieldValue("tags", newTags);
    },
    [setFieldValue]
  );

  return (
    <Form className="NewLinkForm">
      <div className="NewLinkForm-url-container">
        <Field
          type="text"
          name="url"
          className="NewLinkForm-url-input"
          placeholder="Enter URL"
          aria-label="Enter URL"
          pattern={URL_REGEX.source}
          required
        />
        <TextButton type="submit" disabled={!isValid || isSubmitting}>
          Add
        </TextButton>
      </div>
      <TagsForm tags={values.tags} onTagsChange={tagsChangeCallback} />
    </Form>
  );
}

export default function NewLinkForm({ onSubmit, disabled }: NewLinkFormProps) {
  function onFormSubmit(
    values: NewLinkFormValues,
    actions: FormikActions<NewLinkFormValues>
  ) {
    if (onSubmit) {
      onSubmit(values.url, values.tags);
    }

    actions.setSubmitting(false);
  }

  const initialValues: NewLinkFormValues = { url: "", tags: [], tag_input: "" };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmit}
      render={formikProps => <NewLinkFormInner {...formikProps} />}
    />
  );
}
