import Home from "./views/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function Router() {
  const pages = [
    // {
    //   handle: {
    //     breadCrumsCaption: "Detalle",
    //   },
    //   path: "ticket/:number",
    //   element: <Ticket />,
    // },
  ];
  const customRoutes = createBrowserRouter([
    {
      path: "/home",
      element: <Home />,
      children: pages,
    },
  ]);
  return <RouterProvider router={customRoutes} />;
}

export default Router;
