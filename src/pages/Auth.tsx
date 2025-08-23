
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthHeader } from "@/components/auth/AuthHeader";

const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <AuthHeader isLogin={isLogin} />
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <SignupForm onSuccess={handleSuccess} />
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="link" 
            className="w-full text-stp-primary" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? "¿No tienes cuenta? Regístrate" 
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
