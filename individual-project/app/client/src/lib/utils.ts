import { zodResolver } from "@hookform/resolvers/zod";
import { clsx, type ClassValue } from "clsx";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type z from "zod";
import { randomColors, randomColorsDark } from "@/consts/consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserInitials = (username: string) =>
  username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const makeForm = <T extends z.ZodTypeAny>(
  schema: T,
  defaultValues: z.infer<T>
) =>
  useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

export const getRandomColor = (_array: string[], theme?: string) => {
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colorArray = isDark ? randomColorsDark : randomColors;
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};
