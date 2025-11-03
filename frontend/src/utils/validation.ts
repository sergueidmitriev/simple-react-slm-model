/**
 * Validation utilities for model parameters
 */

export const ModelParameterConstraints = {
  temperature: { min: 0, max: 2, step: 0.1 },
  topP: { min: 0.1, max: 1, step: 0.05 },
  topK: { min: 1, max: 100, step: 1 },
} as const;

/**
 * Clamp a number between min and max values
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Validate and clamp temperature parameter
 */
export const validateTemperature = (value: number): number => {
  if (isNaN(value)) return ModelParameterConstraints.temperature.min;
  return clamp(value, ModelParameterConstraints.temperature.min, ModelParameterConstraints.temperature.max);
};

/**
 * Validate and clamp topP parameter
 */
export const validateTopP = (value: number): number => {
  if (isNaN(value)) return ModelParameterConstraints.topP.min;
  return clamp(value, ModelParameterConstraints.topP.min, ModelParameterConstraints.topP.max);
};

/**
 * Validate and clamp topK parameter (rounds to integer)
 */
export const validateTopK = (value: number): number => {
  if (isNaN(value)) return ModelParameterConstraints.topK.min;
  return Math.round(clamp(value, ModelParameterConstraints.topK.min, ModelParameterConstraints.topK.max));
};

/**
 * Validate all model parameters at once
 */
export const validateModelParameters = (params: {
  temperature: number;
  topP: number;
  topK: number;
}): { temperature: number; topP: number; topK: number } => {
  return {
    temperature: validateTemperature(params.temperature),
    topP: validateTopP(params.topP),
    topK: validateTopK(params.topK),
  };
};
