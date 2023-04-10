import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ApiProvider } from "./components/context/ApiContext";
import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ApiProvider>
		<Router />
	</ApiProvider>
);
