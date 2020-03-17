import React from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

const TestQuery = () => (
  <Query
    query={gql`
    {
      Person{
        name
      }
    }
    `}
    ssr={true}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <div>{data.Person.map(({name}) => <p key={name}>{name}</p>)}</div>;
    }}
  </Query>
);

export default TestQuery