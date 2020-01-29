import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { FEED_QUERY } from "../resolvers/queries";
import { POST_MUTATION } from "../resolvers/mutations";
import { LINKS_PER_PAGE } from "../contants";

const CreateLink = props => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.currentTarget.value)}
          type="text"
          placeholder="A URL for the link"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => props.history.push("/new/1")}
        update={(store, { data: { post } }) => {
          const first = LINKS_PER_PAGE;
          const skip = 0;
          const orderBy = "createdAt_DESC";
          const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
          });
          data.feed.links.unshift(post);
          store.writeQuery({
            query: FEED_QUERY,
            data,
            variables: { first, skip, orderBy }
          });
        }}
      >
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
    </>
  );
};

export default CreateLink;
