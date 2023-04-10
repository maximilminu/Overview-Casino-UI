import Visit from "./views/Visit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function Router({ children }) {
  const customRoutes = createBrowserRouter([
    {
      path: "/checkin/:id",
      element: <Visit />,
    },
  ]);

  return <RouterProvider router={customRoutes} />;
}

export default Router;
