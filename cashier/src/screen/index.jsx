import { createElement } from "react";
import { useLocation } from "react-router-dom";
import Pay from "./Pay";

const screens = {
  Pay,
};

const Screen = (props) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  let screenName = pathParts[1].toLowerCase();
  screenName =
    screenName.substring(0, 1).toUpperCase() + screenName.substring(1);
  while (screenName.indexOf("-") > 0) {
    screenName =
      screenName.substring(0, screenName.indexOf("-")) +
      screenName
        .substring(screenName.indexOf("-") + 1, screenName.indexOf("-") + 2)
        .toUpperCase() +
      screenName.substring(screenName.indexOf("-") + 2);
  }
  if (screens[screenName] === undefined) {
    document.location.href =
      process.env.PUBLIC_URL + "/" + Object.keys(screens)[0];
  }
  return createElement(screens[screenName], { ...props });
};

export default Screen;
