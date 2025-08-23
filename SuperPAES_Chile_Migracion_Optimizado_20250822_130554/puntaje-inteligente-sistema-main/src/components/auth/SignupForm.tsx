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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

import { supabase } from '../../integrations/supabase/leonardo-auth-client';
// Improved validation schema for signup
const signupSchema = z.object({
  name: z.string().min(2, { message: "Ingresa un nombre vÃ¡lido (mÃ­nimo 2 caracteres)" }),
  email: z.string()
    .email({ message: "Ingresa un correo electrÃ³nico vÃ¡lido" })
    .refine(email => email.trim() !== "", { message: "El correo electrÃ³nico es obligatorio" }),
  password: z.string()
    .min(6, { message: "La contraseÃ±a debe tener al menos 6 caracteres" })
    .refine(password => /[A-Z]/.test(password), { message: "La contraseÃ±a debe contener al menos una letra mayÃºscula" })
    .refine(password => /[0-9]/.test(password), { message: "La contraseÃ±a debe contener al menos un nÃºmero" }),
  targetCareer: z.string().optional()
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      targetCareer: ""
    },
    mode: "onChange", // Validate on change for better user experience
  });

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Sign up the user with Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            target_career: data.targetCareer || null
          }
        }
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      toast({
        title: "Registro exitoso",
        description: "Revisa tu correo para confirmar tu cuenta"
      });
      
      // In development, auto-login after signup for better experience
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      onSuccess();
    } catch (error: unknown) {
      setFormError(error.message || "OcurriÃ³ un error al registrar tu cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Juan PÃ©rez" 
                  {...field} 
                  autoComplete="name"
                  className="focus:ring-2 focus:ring-stp-primary/50"
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  aria-invalid={!!form.formState.errors.email}
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
          autoComplete="new-password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        
        <FormField
          control={form.control}
          name="targetCareer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrera objetivo (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: IngenierÃ­a Civil, Medicina, etc." 
                  {...field} 
                  className="focus:ring-2 focus:ring-stp-primary/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-stp-primary hover:bg-stp-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </Form>
  );
};




