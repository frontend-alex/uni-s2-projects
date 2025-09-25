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
import type { ForgotPasswordFormProps } from "@/types/types";

export function ForgotPasswordForm({
  forgotPasswordForm,
  handleSubmit,
  isPending,
}: ForgotPasswordFormProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Form {...forgotPasswordForm}>
          <form
            onSubmit={forgotPasswordForm.handleSubmit((data) =>
              handleSubmit?.(data)
            )}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Recover your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to recover to your account information
              </p>
            </div>
            <div className="grid gap-6">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                        className="input no-ring"
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
                    <p>Sending an email...</p>
                  </div>
                ) : (
                  "Send an email"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
