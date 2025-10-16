import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { RegisterFormProps } from "@/types/types";
import { ProviderButtons } from "../buttons/provider-buttons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AppLogo from "@/components/AppLogo";

const PasswordStrengthChecks = lazy(
  () => import("@/components/PasswordChecker")
);

export function RegisterForm({
  registerForm,
  handleSubmit,
  providers,
  isPending,
}: RegisterFormProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit((data) =>
                  handleSubmit?.(data)
                )}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Create an account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to create your new account
                  </p>
                </div>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John"
                              {...field}
                              className="input no-ring"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="grid gap-3">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Doe"
                              {...field}
                              className="input no-ring"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="username"
                            className="input no-ring"
                            placeholder="johndoe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="input no-ring"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            className="input no-ring"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {registerForm.watch("password") ? (
                    <Suspense fallback={null}>
                      <PasswordStrengthChecks
                        password={registerForm.watch("password")}
                      />
                    </Suspense>
                  ) : null}

                  <Button disabled={isPending} type="submit" className="w-full">
                    {isPending ? (
                      <div className="flex items-center gap-3">
                        <LoaderCircle className="animate-spin" />
                        <p>Cerating an account...</p>
                      </div>
                    ) : (
                      "Create an account"
                    )}
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  {providers && (
                    <ProviderButtons
                      providers={providers}
                      isPending={isPending}
                    />
                  )}
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
          <div className="flex items-center justify-center h-full">
            <AppLogo />

          </div>
      </div>
    </div>
  );
}
