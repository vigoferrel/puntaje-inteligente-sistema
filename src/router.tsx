
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PAESDashboard from "./pages/PAESDashboard";
import LectoGuia from "./pages/LectoGuia";
import Diagnostico from "./pages/Diagnostico";
import LearningPlan from "./pages/LearningPlan";
import Auth from "./pages/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/paes-dashboard",
    element: <PAESDashboard />,
  },
  {
    path: "/lectoguia",
    element: <LectoGuia />,
  },
  {
    path: "/diagnostico",
    element: <Diagnostico />,
  },
  {
    path: "/plan",
    element: <LearningPlan />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
