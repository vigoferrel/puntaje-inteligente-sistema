import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Diagnostico from "./pages/Diagnostico";
import Plan from "./pages/Plan";
import Entrenamiento from "./pages/Entrenamiento";
import Contenido from "./pages/Contenido";
import Evaluaciones from "./pages/Evaluaciones";
import Analisis from "./pages/Analisis";
import Reforzamiento from "./pages/Reforzamiento";
import Simulaciones from "./pages/Simulaciones";
import NodeDetail from "./pages/NodeDetail";
import AdminUtils from "./pages/AdminUtils";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/diagnostico",
    element: <Diagnostico />,
  },
  {
    path: "/plan",
    element: <Plan />,
  },
  {
    path: "/entrenamiento",
    element: <Entrenamiento />,
  },
  {
    path: "/contenido",
    element: <Contenido />,
  },
  {
    path: "/evaluaciones",
    element: <Evaluaciones />,
  },
  {
    path: "/analisis",
    element: <Analisis />,
  },
  {
    path: "/reforzamiento",
    element: <Reforzamiento />,
  },
  {
    path: "/simulaciones",
    element: <Simulaciones />,
  },
  {
    path: "/node/:nodeId",
    element: <NodeDetail />,
  },
  {
    path: "/admin",
    element: <AdminUtils />,
  },
]);

export default router;
