/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client';
import { PasswordInput } from "./PasswordInput";
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

const loginSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrÃ³nico vÃ¡lido" }),
  password: z.string().min(6, { message: "La contraseÃ±a debe tener al menos 6 caracteres" })
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) throw error;

      toast({
        title: "Inicio de sesiÃ³n exitoso",
        description: "Bienvenido a SubeTuPuntaje"
      });
      onSuccess();
    } catch (error: unknown) {
      toast({
        title: "Error al iniciar sesiÃ³n",
        description: error.message || "Revisa tus credenciales e intenta nuevamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo ElectrÃ³nico</FormLabel>
              <FormControl>
                <Input 
                  placeholder="tu@correo.com" 
                  {...field} 
                  type="email" 
                  autoComplete="email"
                  className="focus:ring-2 focus:ring-stp-primary/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PasswordInput
          form={form}
          name="password"
          label="ContraseÃ±a"
          autoComplete="current-password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-stp-primary hover:bg-stp-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesiÃ³n..." : "Iniciar SesiÃ³n"}
        </Button>
      </form>
    </Form>
  );
};




