
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PasswordInput } from "./PasswordInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Ingresa un nombre válido (mínimo 2 caracteres)" }),
  email: z.string()
    .email({ message: "Ingresa un correo electrónico válido" })
    .refine(email => email.trim() !== "", { message: "El correo electrónico es obligatorio" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .refine(password => /[A-Z]/.test(password), { message: "La contraseña debe contener al menos una letra mayúscula" })
    .refine(password => /[0-9]/.test(password), { message: "La contraseña debe contener al menos un número" }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change for better user experience
  });

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      toast({
        title: "Registro exitoso",
        description: "Revisa tu correo para confirmar tu cuenta",
      });
      
      // In development, auto-login after signup
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      onSuccess();
    } catch (error: any) {
      setFormError(error.message || "Ocurrió un error al registrar tu cuenta");
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
                  placeholder="Juan Pérez" 
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
              <FormLabel>Correo Electrónico</FormLabel>
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
          label="Contraseña"
          autoComplete="new-password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
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
