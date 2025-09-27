import { Suspense, lazy } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import type { ResetPasswordFormProps } from "@/types/types";

const PasswordStrengthChecks = lazy(() => import("@/components/PasswordChecker"))

export function ResetPasswordForm({
  resetPasswordForm,
  handleSubmit,
  isPending,
}: ResetPasswordFormProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Form {...resetPasswordForm}>
              <form
                onSubmit={resetPasswordForm.handleSubmit((data) =>
                  handleSubmit?.(data)
                )}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Recover your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to recover to your account
                    information
                  </p>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New Password"
                            className="input no-ring"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {resetPasswordForm.watch("newPassword") && (
                    <Suspense fallback={null}>
                      <PasswordStrengthChecks
                        password={resetPasswordForm.watch("newPassword")}
                      />
                    </Suspense>
                  )}

                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Confirm Passowrd</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re Enter Password"
                            className="input no-ring"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={isPending} type="submit" className="w-full">
                    {isPending ? (
                      <div className="flex items-center gap-3">
                        <LoaderCircle className="animate-spin" />
                        <p>Continuing...</p>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
