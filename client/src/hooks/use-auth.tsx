import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};
import React from "react";
import { useLocation } from "wouter";
type LoginData = Pick<User, "username" | "password">;
type RegisterData = Pick<User, "username" | "password" | "fullName" | "email">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation(); // ← This is the redirect function
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/users/current"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        // Try to parse JSON error message if possible
        let errorMessage = "Login failed";
        try {
          const errorBody = await res.json();
          errorMessage = errorBody?.message || errorMessage;
        } catch {
          // Fallback to generic error if body isn't JSON
          if (contentType?.includes("text/html")) {
            errorMessage = "Unexpected HTML response from server";
          }
        }
        throw new Error(errorMessage);
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Unexpected response format from server");
      }

      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/users/current"], user); // <-- Updated key!
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName}!`,
        variant: "default",
      });
      setLocation("/"); // 👈 redirect after login success
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // const loginMutation = useMutation({
  //   mutationFn: async (credentials: LoginData) => {
  //     const res = await apiRequest("POST", "/api/login", credentials);
  //     return await res.json();
  //   },
  //   onSuccess: (user: User) => {
  //     queryClient.setQueryData(["/api/user"], user);
  //     toast({
  //       title: "Login successful",
  //       description: `Welcome back, ${user.fullName}!`,
  //       variant: "default",
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Login failed",
  //       description: error.message || "Invalid username or password",
  //       variant: "destructive",
  //     });
  //   },
  // });
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorBody = await res.json();
          errorMessage = errorBody?.message || errorMessage;
        } catch {
          if (contentType?.includes("text/html")) {
            errorMessage = "Unexpected HTML response from server";
          }
        }
        throw new Error(errorMessage);
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Unexpected response format from server");
      }

      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/users/current"], user); // 🔄 Consistent with login
      toast({
        title: "Registration successful",
        description: `Welcome to LoanSpa, ${user.fullName}!`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });

  // const registerMutation = useMutation({
  //   mutationFn: async (userData: RegisterData) => {
  //     const res = await apiRequest("POST", "/api/register", userData);
  //     return await res.json();
  //   },
  //   onSuccess: (user: User) => {
  //     queryClient.setQueryData(["/api/user"], user);
  //     toast({
  //       title: "Registration successful",
  //       description: `Welcome to LoanSpa, ${user.fullName}!`,
  //       variant: "default",
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Registration failed",
  //       description: error.message || "Unable to create account",
  //       variant: "destructive",
  //     });
  //   },
  // });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        let errorMessage = "Logout failed";
        try {
          const errorBody = await res.json();
          errorMessage = errorBody?.message || errorMessage;
        } catch {
          errorMessage = "Unexpected response from server";
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/users/current"], null); // 🔄 Match updated key
      queryClient.invalidateQueries();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // const logoutMutation = useMutation({
  //   mutationFn: async () => {
  //     await apiRequest("POST", "/api/logout");
  //   },
  //   onSuccess: () => {
  //     queryClient.setQueryData(["/api/user"], null);
  //     // Invalidate all queries to force a refetch
  //     queryClient.invalidateQueries();
  //     toast({
  //       title: "Logged out",
  //       description: "You have been logged out successfully",
  //       variant: "default",
  //     });
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Logout failed",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
