import React, { useState } from "react";
import "./index.css";
import { getParamAsArray, setParam } from "../../util/getParam";
import { deduplicate } from "../../util/array";
import TextButton from "../TextButton";
import TagsForm from "../TagsForm";

interface SearchFormProps {}

export default function SearchForm(props: SearchFormProps) {
  const tags = getParamAsArray("t");

  function onTagsChange(newTags: string[]) {
    setParam("t", newTags);
  }

  return (
    <div className="SearchForm">
      <TagsForm tags={tags} onTagsChange={onTagsChange} />
    </div>
  );
}
