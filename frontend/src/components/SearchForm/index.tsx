import React, { useState, useEffect, FormEvent } from "react";
import "./index.css";
import { getParamAsArray, setParam } from "../../util/getParam";
import { deduplicate } from "../../util/array";

interface SearchFormProps {}

export default function SearchForm(props: SearchFormProps) {
  const [inputVal, setInputVal] = useState("");

  const tags = getParamAsArray("t");

  function addInputAsTag() {
    tags.push(inputVal);
    const deduped = deduplicate(tags);
    setParam("t", deduped);
  }

  function onInputChange(event: React.FormEvent<HTMLInputElement>) {
    setInputVal(event.currentTarget.value);
  }

  function onInputKeyPress(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      addInputAsTag();
      setInputVal("");
    }
  }

  return (
    <div className="SearchForm">
      <div className="SearchForm-input-container">
        <input
          className="SearchForm-input"
          id="add-tag"
          name="add-tag"
          placeholder="Add tag"
          value={inputVal}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
      </div>
      <div className="SearchForm-tag-list">
        {tags.map(tag => (
          <p className="SearchForm-tag" key={tag}>
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
}
