import { useState } from "react";
import { ChevronRight, LoaderCircle, Lock, LockOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { questionnaireSteps } from "@/consts/consts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { WorkspaceVisibility } from "@/types/enum";
import { useAuth } from "@/contexts/AuthContext";
import type { WorkspaceSchemaType } from "@/utils/schemas/workspace/workspace.schema";
import { useApiMutation } from "@/hooks/hook";
import { API } from "@/lib/config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const OnboardingPage = () => {
  const { user, update } = useAuth();

  const form = useForm<WorkspaceSchemaType>({
    defaultValues: {
      name: `${user?.username}'s Workspace` || "",
      visibility: WorkspaceVisibility.PUBLIC,
    },
  });

  const vis = form.watch("visibility");

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleOptionSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentStep + 1]: optionId });
    if (currentStep < questionnaireSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleVisibility = () => {
    form.setValue(
      "visibility",
      vis === WorkspaceVisibility.PUBLIC
        ? WorkspaceVisibility.PRIVATE
        : WorkspaceVisibility.PUBLIC,
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const { mutateAsync: createWorkspace, isPending: isWorkspacePending } =
    useApiMutation("POST", API.ENDPOINTS.WORKSPACE.WORKSPACE, {
      onSuccess: (data) => {
        if (data.success && data.data) {
          update({ onboarding: true });
        }
      },
    });

  const handleWorkspace = async (data: WorkspaceSchemaType) =>
    createWorkspace(data);

  return (
    <div className="h-dvh flex flex-col">
      {/* Flat Progress Indicator */}
      <div className="flex">
        {questionnaireSteps.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1 flex-1  ${
              index <= currentStep ? "bg-primary" : "bg-muted"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index <= currentStep ? 1 : 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center"
            >
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold mb-4"
              >
                {questionnaireSteps[currentStep].question}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg text-muted-foreground mb-8"
              >
                {questionnaireSteps[currentStep].description}
              </motion.p>

              {/* Options Grid or Form */}
              {questionnaireSteps[currentStep].isForm ? (
                <Form {...form}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="max-w-md mx-auto mb-8"
                  >
                    <form
                      onSubmit={form.handleSubmit((data) =>
                        handleWorkspace(data)
                      )}
                    >
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="workspace-name"
                            className="text-sm font-medium text-stone-400 mb-2"
                          >
                            Workspace Name
                          </Label>
                          <div className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <Input
                                      className="input no-ring"
                                      placeholder="e.g., My Study Room, Team Alpha, Learning Hub"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="visibility"
                              render={() => (
                                <FormItem>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={
                                          vis === WorkspaceVisibility.PUBLIC
                                            ? "secondary"
                                            : "default"
                                        }
                                        onClick={toggleVisibility}
                                        disabled={isWorkspacePending}
                                        className="shrink-0"
                                      >
                                        {vis === WorkspaceVisibility.PUBLIC ? (
                                          <>
                                            <LockOpen className="mr-2 h-4 w-4" />
                                            Public
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Private
                                          </>
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-accent">
                                      <p className="text-sm text-stone-400">
                                        {vis === WorkspaceVisibility.PUBLIC
                                          ? "Anyone with a link can view this workspace."
                                          : "Only invited members can access this workspace."}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-stone-400">
                          This will be the name of your personal learning space
                        </p>
                      </div>
                    </form>
                  </motion.div>
                </Form>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                >
                  {questionnaireSteps[currentStep].options?.map((option) => {
                    const isSelected = answers[currentStep + 1] === option.id;
                    const Icon = option.icon;

                    return (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`
                            relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
                            ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-accent hover:border-primary/50 hover:bg-accent/5"
                            }
                          `}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-primary p-3 rounded-lg">
                            <Icon className="size-6 text-primary-foreground" />
                          </div>
                          <span className={`text-lg font-medium`}>
                            {option.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex justify-center gap-4"
              >
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    disabled={currentStep === 0 || isWorkspacePending}
                    className="px-6 py-2 border border-muted rounded-lg hover:bg-muted transition-colors"
                  >
                    Previous
                  </motion.button>
                )}

                {currentStep < questionnaireSteps.length - 1 ? (
                  ""
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isWorkspacePending}
                    onClick={() => form.handleSubmit(handleWorkspace)()}
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      !isWorkspacePending
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isWorkspacePending ? <LoaderCircle /> : ""}{" "}
                    {isWorkspacePending ? "Creating..." : "Complete Setup"}
                    <ChevronRight className="size-4" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
