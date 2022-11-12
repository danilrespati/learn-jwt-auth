import React from "react";
import { RouteProps } from "react-router-dom";
import { useByeQuery } from "../generated/graphql";

export const Account: React.FC<RouteProps> = () => {
  const { data, loading, error } = useByeQuery({ fetchPolicy: "network-only" });

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }
  if (loading || !data) {
    return <div>loading...</div>;
  }

  return <div>{data.bye}</div>;
};
