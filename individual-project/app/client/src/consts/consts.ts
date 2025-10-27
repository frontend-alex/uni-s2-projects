import { User, Users, BookOpen } from "lucide-react";

export const questionnaireSteps = [
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

export const randomColors = [
  "#ef444433",
  "#3b82f633",
  "#22c55e33",
  "#eab30833",
  "#a855f733",
  "#ec489933",
  "#6366f133",
  "#14b8a633",
  "#f9731633",
];

export const randomColorsDark = [
  "#f8717166",
  "#60a5fa66",
  "#4ade8066",
  "#fbbf2466",
  "#c084fc66",
  "#fb718566",
  "#818cf866",
  "#2dd4bf66",
  "#fb923c66",
];
