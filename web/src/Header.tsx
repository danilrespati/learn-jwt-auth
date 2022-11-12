import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "./accessToken";
import { useLogoutMutation, useMeQuery } from "./generated/graphql";

interface Props {}

export const Header: React.FC<Props> = () => {
  const { data } = useMeQuery();

  const [logout, { client }] = useLogoutMutation();

  const isLoggedIn = data && data.me ? true : false;

  return (
    <header>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/account">Account</Link>
      </div>
      {isLoggedIn && <div>you are logged in as: {data!.me!.email}</div>}
      {isLoggedIn && (
        <button
          onClick={async () => {
            setAccessToken("");
            await logout();
            await client.resetStore();
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
};
