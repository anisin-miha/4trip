const BRAND_SUFFIX = " | 4-trip.ru";

type MetaField = "title" | "description";

type ValidateOptions = {
  min?: number;
  max?: number;
  context?: string;
};

const DEFAULT_LIMITS: Record<MetaField, Required<ValidateOptions>> = {
  // Обычно в выдаче стабильно помещается до ~55–60 символов
  title: { min: 35, max: 60, context: "" },

  // Для десктопа и мобилок безопасный коридор ~70–155 символов
  description: { min: 70, max: 155, context: "" },
};


const isDev = process.env.NODE_ENV !== "production";

function warnLength(
  field: MetaField,
  value: string,
  options?: ValidateOptions,
) {
  if (!isDev) return;
  const limits = { ...DEFAULT_LIMITS[field], ...options };
  const length = value.length;
  if (
    (typeof limits.min === "number" && length < limits.min) ||
    (typeof limits.max === "number" && length > limits.max)
  ) {
    const label = limits.context ? ` (${limits.context})` : "";
    console.warn(
      `[meta] ${field}${label}: length ${length} is out of recommended range ${limits.min}-${limits.max}. Value: "${value}"`,
    );
  }
}

function appendBrandSuffix(title: string) {
  const trimmed = title.trim();
  if (trimmed.endsWith(BRAND_SUFFIX)) return trimmed;
  return `${trimmed}${BRAND_SUFFIX}`;
}

export function composeMetaTitle(
  baseTitle: string,
  options?: ValidateOptions,
) {
  const result = appendBrandSuffix(baseTitle);
  warnLength("title", result, options);
  return result;
}

export function composeMetaDescription(
  description: string,
  options?: ValidateOptions,
) {
  const trimmed =
    typeof description === "string" ? description.trim() : description;
  warnLength("description", trimmed, options);
  return trimmed;
}

export function validateMetaLength(
  field: MetaField,
  value: string,
  options?: ValidateOptions,
) {
  warnLength(field, value, options);
}
