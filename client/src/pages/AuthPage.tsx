import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CircleDollarSign, Mail, Settings, ShieldCheck, User, UserCircle } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Use useEffect for navigation to avoid React hook issues
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // If already authenticated, return empty while redirecting
  if (user) {
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
    },
  });

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/");
      }
    });
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
        navigate("/");
      }
    });
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <LoanIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">LoanSPA</h1>
            </div>
            <p className="text-muted-foreground mt-2">Manage your loans with ease</p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Enter your username" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" placeholder="Enter your password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Choose a username" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Enter your full name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="email" placeholder="Enter your email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" placeholder="Create a password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-center p-10 lg:p-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">Manage Your Loans with Ease</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <CircleDollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Simplified Loan Management</h3>
                <p className="text-muted-foreground">Track all your loans in one place with a clear overview of payments, schedules, and balances.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Secure Transactions</h3>
                <p className="text-muted-foreground">Make payments securely and track your transaction history with confidence.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Flexible Payment Options</h3>
                <p className="text-muted-foreground">Reschedule, defer, or make extra payments with just a few clicks to suit your financial situation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}