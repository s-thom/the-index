import React from "react";
import "./index.css";
import {
  getParamAsArray,
  setParam,
  getParamAsString
} from "../../util/getParam";
import TagsForm from "../TagsForm";
import DatetimeForm from "../DatetimeForm";

interface SearchFormProps {}

export default function SearchForm(props: SearchFormProps) {
  const tags = getParamAsArray("t");
  const beforeString = getParamAsString("b");
  const afterString = getParamAsString("a");

  const beforeDate = beforeString ? new Date(beforeString) : undefined;
  const afterDate = afterString ? new Date(afterString) : undefined;

  function onTagsChange(newTags: string[]) {
    setParam("t", newTags);
  }

  function onBeforeDateChange(newDate?: Date) {
    setParam("b", newDate && newDate.toISOString());
  }

  function onAfterDateChange(newDate?: Date) {
    setParam("a", newDate && newDate.toISOString());
  }

  return (
    <div className="SearchForm">
      <div className="SearchForm-tags">
        <h4 className="SearchForm-section-heading">Tags</h4>
        <TagsForm tags={tags} onTagsChange={onTagsChange} />
      </div>
      <div className="SearchForm-dates">
        <div className="SearchForm-dates-before">
          <h4 className="SearchForm-section-heading">Before</h4>
          <DatetimeForm date={beforeDate} onDateChange={onBeforeDateChange} />
        </div>
        <div className="SearchForm-dates-after">
          <h4 className="SearchForm-section-heading">After</h4>
          <DatetimeForm date={afterDate} onDateChange={onAfterDateChange} />
        </div>
      </div>
    </div>
  );
}