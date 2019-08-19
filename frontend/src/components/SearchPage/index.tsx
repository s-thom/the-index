import React, { useState, useEffect } from "react";
import "./index.css";
import { LinkDetail } from "../../types";
import LinkItem from "../LinkItem";
import { searchByTag } from "../../requests";
import { RouteComponentProps } from "@reach/router";
import { getParamAsArray } from "../../util/getParam";
import SearchForm from "../SearchForm";

interface SearchPageProps extends RouteComponentProps {}

export default function SearchPage(props: SearchPageProps) {
  const [links, setLinks] = useState<LinkDetail[]>([]);

  const tags = getParamAsArray("t");

  async function requestLinksByTags(tags: string[]) {
    const links = await searchByTag(tags);
    setLinks(links);
  }

  const tagsString = tags.join(",");
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    requestLinksByTags(tags);
  }, [tagsString]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="SearchPage">
      <div className="SearchPage-form">
        <SearchForm />
      </div>
      <div className="SearchPage-link-list">
        {links.map(link => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
