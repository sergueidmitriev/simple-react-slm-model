import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface UseFormStateReturn<T> {
  formState: T;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  setFormState: Dispatch<SetStateAction<T>>;
  reset: () => void;
}

/**
 * Custom hook for managing form state that syncs with external data
 * @param initialData - Initial data to populate form
 * @param shouldSync - Condition to trigger sync (e.g., modal open)
 */
export const useFormState = <T extends Record<string, unknown>>(
  initialData: T,
  shouldSync: boolean
): UseFormStateReturn<T> => {
  const [formState, setFormState] = useState<T>(initialData);

  // Sync with external data when condition is met
  useEffect(() => {
    if (shouldSync) {
      setFormState(initialData);
    }
  }, [shouldSync, initialData]);

  // Update a single field
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Reset to initial data
  const reset = () => {
    setFormState(initialData);
  };

  return { formState, updateField, setFormState, reset };
};
