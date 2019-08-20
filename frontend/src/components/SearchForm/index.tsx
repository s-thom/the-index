import React, { useState } from "react";
import "./index.css";
import { getParamAsArray, setParam } from "../../util/getParam";
import { deduplicate } from "../../util/array";
import TextButton from "../TextButton";

interface SearchFormProps {}

export default function SearchForm(props: SearchFormProps) {
  const [inputVal, setInputVal] = useState("");

  const tags = getParamAsArray("t");

  function addInputAsTag() {
    tags.push(inputVal);
    const deduped = deduplicate(tags);
    setParam("t", deduped);
  }

  function removeTag(tag: string) {
    const filtered = tags.filter(t => t !== tag);
    setParam("t", filtered);
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
      <ul className="SearchForm-tag-list">
        {tags.map(tag => (
          <li className="SearchForm-tag" key={tag}>
            <TextButton
              onClick={() => removeTag(tag)}
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
  );
}
