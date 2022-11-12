import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery();

  if (loading || !data) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div>Users:</div>
      <ul>
        {data.users.map((user) => {
          return <li key={user.id}>{`${user.id} - ${user.email}`}</li>;
        })}
      </ul>
    </div>
  );
};
