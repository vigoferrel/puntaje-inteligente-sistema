
import React from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "@/components/ui/icons";

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-stp-primary to-stp-secondary p-2 rounded-md">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <div className="font-bold text-2xl text-stp-dark ml-2">SubeTuPuntaje</div>
      </div>
      <CardTitle className="text-2xl text-center">
        {isLogin ? "Inicia Sesión" : "Crea tu Cuenta"}
      </CardTitle>
      <CardDescription className="text-center">
        {isLogin 
          ? "Ingresa tus credenciales para continuar" 
          : "Regístrate para comenzar tu preparación PAES"}
      </CardDescription>
    </>
  );
};
