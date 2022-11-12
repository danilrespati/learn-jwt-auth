let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;
  return true;
};

export const getAccessToken = () => {
  return accessToken;
};
