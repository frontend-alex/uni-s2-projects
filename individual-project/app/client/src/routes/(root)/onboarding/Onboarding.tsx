import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Users, BookOpen, ChevronRight } from "lucide-react";
import AppLogo from "@/components/AppLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const questionnaireSteps = [
  {
    id: 1,
    question: "What brings you here today?",
    description: "Help us understand your learning goals",
    options: [
      { id: "academic", label: "Academic studies", icon: BookOpen },
      { id: "professional", label: "Professional development", icon: User },
      { id: "personal", label: "Personal interest", icon: BookOpen },
      { id: "other", label: "Something else", icon: User },
    ],
  },
  {
    id: 2,
    question: "How do you prefer to learn?",
    description: "Choose your learning style",
    options: [
      { id: "solo", label: "Solo learning", icon: User },
      { id: "group", label: "Group study", icon: Users },
      { id: "both", label: "Both, depending on the topic", icon: Users },
    ],
  },
  {
    id: 3,
    question: "Will you be creating content?",
    description: "Let us know if you plan to share knowledge",
    options: [
      {
        id: "yes",
        label: "Yes, I'll create quizzes and content",
        icon: BookOpen,
      },
      { id: "maybe", label: "Maybe, I'm not sure yet", icon: User },
      { id: "no", label: "No, I'm here to learn only", icon: BookOpen },
    ],
  },
  {
    id: 4,
    question: "What should we call your workspace?",
    isForm: true,
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [workspaceName, setWorkspaceName] = useState("");

  const handleOptionSelect = (optionId: string) => {
    setAnswers({ ...answers, [currentStep + 1]: optionId });
    // Auto-advance to next step when option is selected
    if (currentStep < questionnaireSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300); // Small delay for smooth transition
    }
  };

  const nextStep = () => {
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepAnswered = () => {
    if (questionnaireSteps[currentStep].isForm) {
      return workspaceName.trim().length > 0;
    }
    return answers[currentStep + 1] !== undefined;
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Questionnaire Content */}
      <div className="flex flex-col">
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
                  className="text-stone-400  mb-8"
                >
                  {questionnaireSteps[currentStep].description}
                </motion.p>

                {/* Options Grid or Form */}
                {questionnaireSteps[currentStep].isForm ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="max-w-md mx-auto mb-8"
                  >
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="workspace-name"
                          className="text-sm font-medium text-stone-400 mb-2"
                        >
                          Workspace Name
                        </Label>
                        <Input
                          id="workspace-name"
                          type="text"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          placeholder="e.g., My Study Room, Team Alpha, Learning Hub"
                          className="input no-ring"
                        />
                      </div>
                      <p className="text-sm text-stone-400">
                        This will be the name of your personal learning space
                      </p>
                    </div>
                  </motion.div>
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
                            <span
                              className={`text-lg font-medium ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}
                            >
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
                      className="px-6 py-2 border border-muted rounded-lg hover:bg-muted transition-colors"
                    >
                      Previous
                    </motion.button>
                  )}

                  {currentStep < questionnaireSteps.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      disabled={!isCurrentStepAnswered()}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        isCurrentStepAnswered()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Navigate to dashboard or complete onboarding
                        console.log("Questionnaire completed!", {
                          ...answers,
                          workspaceName,
                        });
                      }}
                      disabled={!isCurrentStepAnswered()}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        isCurrentStepAnswered()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Complete Setup
                      <ChevronRight className="size-4" />
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="bg-muted relative hidden lg:block">
        <div className="flex items-center justify-center h-full">
          <AppLogo />
        </div>
      </div>
    </div>
  );
}
