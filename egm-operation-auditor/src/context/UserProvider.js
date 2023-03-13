import { useContext, useLayoutEffect } from "react";
import { createContext, useState } from "react";
import { ApiContext } from "./ApiContext";
import jwt_decode from "jwt-decode";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState();
  const { AccessToken } = useContext(ApiContext);

  useLayoutEffect(() => {
    setUserProfile(jwt_decode(AccessToken).Profile);
    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider value={userProfile}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
