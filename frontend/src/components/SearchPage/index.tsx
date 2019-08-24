import React, { useState, useEffect } from "react";
import "./index.css";
import { LinkDetail } from "../../types";
import LinkItem from "../LinkItem";
import { RouteComponentProps } from "@reach/router";
import { getParamAsArray, getParamAsString } from "../../util/getParam";
import SearchForm from "../SearchForm";
import { useRequester } from "../../hooks/requests";

interface SearchPageProps extends RouteComponentProps {}

export default function SearchPage(props: SearchPageProps) {
  const [links, setLinks] = useState<LinkDetail[]>([]);
  const requester = useRequester();

  const tags = getParamAsArray("t");
  const beforeString = getParamAsString("b");
  const afterString = getParamAsString("a");

  const tagsString = tags.join(",");
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const beforeDate = beforeString ? new Date(beforeString) : undefined;
    const afterDate = afterString ? new Date(afterString) : undefined;

    async function requestLinksByTags() {
      const links = await requester.searchByTag(tags, beforeDate, afterDate);
      setLinks(links);
    }

    requestLinksByTags();
  }, [tagsString, beforeString, afterString]);
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
