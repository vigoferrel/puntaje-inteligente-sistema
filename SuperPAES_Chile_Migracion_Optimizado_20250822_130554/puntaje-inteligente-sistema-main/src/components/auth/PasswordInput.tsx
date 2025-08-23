/* eslint-disable react-refresh/only-export-components */

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PasswordInputProps {
  form: UseFormReturn<unknown>;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PasswordInput = ({
  form,
  name,
  label,
  placeholder = "",
  autoComplete = "current-password",
  showPassword,
  setShowPassword
}: PasswordInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                {...field} 
                type={showPassword ? "text" : "password"} 
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="pr-10 focus:ring-2 focus:ring-stp-primary/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

