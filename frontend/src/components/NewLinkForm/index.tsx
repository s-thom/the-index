import React from "react";
import { Formik, FormikActions, Form, Field, FieldArray } from "formik";
import "./index.css";
import TextButton from "../TextButton";

interface NewLinkFormProps {
  onSubmit?: (url: string, tags: string[]) => void;
  disabled?: boolean;
}

interface NewLinkFormValues {
  url: string;
  tags: string[];
  tag_input: string;
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
      render={({ values, setFieldValue }) => (
        <Form className="NewLinkForm">
          <div className="NewLinkForm-url-container">
            <Field
              type="text"
              name="url"
              className="NewLinkForm-url-input"
              placeholder="Enter URL"
              aria-label="Enter URL"
              pattern="^https?:\/\/(?:\w+\.)*\w+(?::\d{1,5})?(?:\/.*)?$"
              required
            />
            <TextButton type="submit" disabled={disabled}>
              Add
            </TextButton>
          </div>
          <FieldArray
            name="tags"
            render={({ remove, push }) => (
              <div className="NewLinkForm-tag-container">
                <div className="NewLinkForm-tag-input-container">
                  <Field
                    type="text"
                    name="tag_input"
                    className="NewLinkForm-tag-input"
                    placeholder="Add Tag"
                    aria-label="Add Tag"
                    pattern="^[a-zA-Z_-]+$"
                    onKeyPress={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      // Add the tag if enter or space is pressed
                      if (event.key === " " || event.key === "Enter") {
                        const val = values.tag_input.trim();
                        if (val) {
                          const alreadyExists = values.tags.indexOf(val) > -1;
                          if (!alreadyExists) {
                            push(values.tag_input.trim());
                            setFieldValue("tag_input", "");
                          }
                        }
                        event.preventDefault();
                        event.stopPropagation();
                      }
                    }}
                  />
                </div>
                <ul className="NewLinkForm-tags">
                  {values.tags.map((tag, index) => (
                    <li className="SearchForm-tag" key={tag}>
                      <TextButton
                        type="button"
                        onClick={() => remove(index)}
                        title="Remove"
                        aria-label={`Remove ${tag}`}
                      >
                        -
                      </TextButton>{" "}
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
        </Form>
      )}
    />
  );
}