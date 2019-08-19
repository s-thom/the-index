import React, { useState, useEffect } from "react";
import "./index.css";
import { LinkDetail } from "../../types";
import LinkItem from "../LinkItem";
import { searchByTag } from "../../requests";

interface BodyAreaProps {}

export default function BodyArea(props: BodyAreaProps) {
  const [links, setLinks] = useState<LinkDetail[]>([]);

  async function requestLinksByTags(tags: string[]) {
    const links = await searchByTag(tags);
    setLinks(links);
  }

  useEffect(() => {
    requestLinksByTags(["test", "example"]);
  }, []);

  return (
    <div className="BodyArea">
      <div className="BodyArea-link-list">
        {links.map(link => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
