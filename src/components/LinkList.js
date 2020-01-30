import React from "react";
import Link from "./Link";
import { Query } from "react-apollo";
import { LINKS_PER_PAGE } from "../contants";
import { isNewPage, pageIndex, queryParams, getPage } from "../utils";
import { FEED_QUERY } from "../resolvers/queries";
import {
  NEW_LINKS_SUBSCRIPTION,
  NEW_VOTES_SUBSCRIPTION
} from "../resolvers/subscriptions";

const LinkList = props => {
  const _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: queryParams(getPage(props))
    });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  const _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);

        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        });
      }
    });
  };

  const _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    });
  };

  const _getQueryVariables = () => queryParams(getPage(props));

  const _getLinksToRender = data => {
    if (isNewPage(props)) {
      return data.feed.links;
    }

    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((right, left) => left.votes.length - right.votes.length);

    return rankedLinks;
  };

  const _previousPage = () => {
    const page = getPage(props);
    if (page > 1) {
      const previousPage = page - 1;

      props.history.push(`/new/${previousPage}`);
    }
  };

  const _nextPage = data => {
    const page = getPage(props);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;

      props.history.push(`/new/${nextPage}`);
    }
  };

  return (
    <Query query={FEED_QUERY} variables={_getQueryVariables()}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching...</div>;
        if (error) return <div>Error :(</div>;

        _subscribeToNewLinks(subscribeToMore);
        _subscribeToNewVotes(subscribeToMore);

        const linksToRender = _getLinksToRender(data);

        return (
          <div>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex(props)}
                updateStoreAfterVote={_updateCacheAfterVote}
              />
            ))}
            {isNewPage(props) && (
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={_previousPage}>
                  Previous
                </div>
                <div className="pointer" onClick={() => _nextPage(data)}>
                  Next
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

export default LinkList;
