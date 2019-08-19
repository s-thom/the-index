import React, { useState, useEffect } from "react";
import "./index.css";
import { LinkDetail } from "../../types";
import LinkItem from "../LinkItem";
import { searchByTag } from "../../requests";
import { RouteComponentProps } from "@reach/router";

interface SearchPageProps extends RouteComponentProps {}

export default function SearchPage(props: SearchPageProps) {
  const [links, setLinks] = useState<LinkDetail[]>([]);

  async function requestLinksByTags(tags: string[]) {
    const links = await searchByTag(tags);
    setLinks(links);
  }

  useEffect(() => {
    requestLinksByTags(["test", "example"]);
  }, []);

  return (
    <div className="SearchPage">
      <div className="SearchPage-link-list">
        {links.map(link => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
