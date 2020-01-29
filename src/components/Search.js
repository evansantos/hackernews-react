import React, { useState } from "react";
import { withApollo } from "react-apollo";
import Link from "./Link";
import { FEED_SEARCH_QUERY } from "../resolvers/queries";

const Search = props => {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  const _executeSearch = async () => {
    const result = await props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });

    const links = result.data.feed.links;
    setLinks(links);
  };

  return (
    <>
      <div>
        <span className="pr2">Search</span>
        <input type="text" onChange={e => setFilter(e.currentTarget.value)} />
        <button onClick={() => _executeSearch()}>OK</button>
      </div>
      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </>
  );
};

export default withApollo(Search);
