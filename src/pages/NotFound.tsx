
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="bg-gradient-to-r from-stp-primary to-stp-secondary p-3 rounded-full inline-flex mb-6">
          <div className="text-white text-2xl">🔍</div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="bg-stp-primary hover:bg-stp-primary/90">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
