import { createElement } from "react";
import Home from "./Home";
import UserCard from "../components/UserCard";
import UserList from "../components/UserList";

const screens = {
  Home,
  UserList,
  UserCard,
};

const Screen = (props) => {
  return createElement(screens[props.name], { ...props });
};

export default Screen;
