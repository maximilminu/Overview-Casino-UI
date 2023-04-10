import React, { memo, useLayoutEffect, useState } from "react";

export const SecureBrowserContext = React.createContext({});

export const SecureBrowserProvider = memo(({ children }) => {
  const [ secureBrowser, setSecureBrowser ] = useState(false);

  const checkSecureBrowserInit = () => {
    if (window.SecureBrowser) {
      setSecureBrowser(window.SecureBrowser);
    } else {
      setTimeout(checkSecureBrowserInit, 250);
    }
  }

  useLayoutEffect(() => {
    checkSecureBrowserInit();
  },[]);

  return (
    <SecureBrowserContext.Provider value={secureBrowser}>
      {secureBrowser && children}
    </SecureBrowserContext.Provider>
  );
});
