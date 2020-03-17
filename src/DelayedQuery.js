import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from "graphql-tag";

class DelayedQuery extends Component {
  state = { movies: null };

  onDogFetched = persons => this.setState(() => ({ persons }));

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div>
            {this.state.persons && console.log(this.state.persons)}
            <button
              onClick={async () => {
                const startTime = new Date().getMilliseconds()
                const { data } = await client.query({
                  query: gql`
                  {
                    Person{
                      name
                    }
                  }
                  `,
                  fetchPolicy: "network-only"
                });
                console.log(new Date().getMilliseconds() - startTime)
                this.onDogFetched(data.Person);
              }}
            >
              Click me!
            </button>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default DelayedQuery