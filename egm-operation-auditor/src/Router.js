import Home from "./views/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Ticket from "./views/Ticket";

function Router() {
  const pages = [
    {
      handle: {
        breadCrumsCaption: "Detalle",
      },
      path: "ticket/:number",
      element: <Ticket />,
    },
  ];
  const customRoutes = createBrowserRouter([
    {
      path: "/egm-operation-auditor",
      element: <Home />,
      children: pages,
    },
  ]);
  return <RouterProvider router={customRoutes} />;
}

export default Router;
