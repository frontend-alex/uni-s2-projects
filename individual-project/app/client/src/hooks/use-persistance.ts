import { toast } from "sonner";
import { useState, useEffect } from "react";

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      toast.error(`Failed to save key "${key}"`);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
