import React from "react";
import { Mutation } from "react-apollo";
import { AUTH_TOKEN } from "../contants";
import { timeDifferenceForDate, getDomain } from "../utils";
import { VOTE_MUTATION } from "../resolvers/mutations";

const Link = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: props.link.id }}
            update={(store, { data: { vote } }) =>
              props.updateStoreAfterVote(store, vote, props.link.id)
            }
          >
            {voteMutation => (
              <div className="ml1 gray f11 pointer" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          <span className="f6">{props.link.description} </span>{" "}
          <a
            className="f7 gray no-underline underline-hover"
            href={props.link.url}
          >
            ({getDomain(props.link.url)})
          </a>
        </div>
        <div className="f7 lh-copy gray">
          {props.link.votes.length} votes | by{" "}
          {props.link.postedBy ? props.link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
