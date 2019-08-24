import React, { useState } from "react";
import "./index.css";
import { deduplicate } from "../../util/array";
import TextButton from "../TextButton";

interface TagsFormProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
}

export default function TagsForm({ tags, onTagsChange }: TagsFormProps) {
  const [inputVal, setInputVal] = useState("");

  function addInputAsTag() {
    tags.push(inputVal);
    const deduped = deduplicate(tags);
    if (onTagsChange) {
      onTagsChange(deduped);
    }
  }

  function removeTag(tag: string) {
    const filtered = tags.filter(t => t !== tag);
    if (onTagsChange) {
      onTagsChange(filtered);
    }
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
    <div className="TagsForm">
      <div className="TagsForm-input-container">
        <input
          className="TagsForm-input"
          id="add-tag"
          name="add-tag"
          placeholder="Add tag"
          value={inputVal}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
      </div>
      <ul className="TagsForm-tag-list">
        {tags.map(tag => (
          <li className="TagsForm-tag" key={tag}>
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
