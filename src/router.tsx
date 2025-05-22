
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Plan from "./pages/Plan";
import LectoGuia from "./pages/LectoGuia";
import Diagnostico from "./pages/Diagnostico";
import Entrenamiento from "./pages/Entrenamiento";
import Contenido from "./pages/Contenido";
import Evaluaciones from "./pages/Evaluaciones";
import Analisis from "./pages/Analisis";
import Reforzamiento from "./pages/Reforzamiento";
import Simulaciones from "./pages/Simulaciones";
import NodeDetail from "./pages/NodeDetail";
import AdminUtils from "./pages/AdminUtils";
import Settings from "./pages/Settings";
import { ProtectedRoute } from './components/protected-route';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/plan",
    element: <ProtectedRoute><Plan /></ProtectedRoute>,
  },
  {
    path: "/lectoguia",
    element: <ProtectedRoute><LectoGuia /></ProtectedRoute>,
  },
  {
    path: "/diagnostico",
    element: <ProtectedRoute><Diagnostico /></ProtectedRoute>,
  },
  {
    path: "/entrenamiento",
    element: <ProtectedRoute><Entrenamiento /></ProtectedRoute>,
  },
  {
    path: "/contenido",
    element: <ProtectedRoute><Contenido /></ProtectedRoute>,
  },
  {
    path: "/evaluaciones",
    element: <ProtectedRoute><Evaluaciones /></ProtectedRoute>,
  },
  {
    path: "/analisis",
    element: <ProtectedRoute><Analisis /></ProtectedRoute>,
  },
  {
    path: "/reforzamiento",
    element: <ProtectedRoute><Reforzamiento /></ProtectedRoute>,
  },
  {
    path: "/simulaciones",
    element: <ProtectedRoute><Simulaciones /></ProtectedRoute>,
  },
  {
    path: "/node/:nodeId",
    element: <ProtectedRoute><NodeDetail /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminUtils /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
