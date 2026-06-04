const DEFAULT_LOCATION_TEXT = "Chưa cập nhật";

const stripWrapper = (value) =>
  String(value || "")
    .trim()
    .replace(/^\[|\]$/g, "")
    .replace(/^['"]|['"]$/g, "")
    .trim();

export const parseJobLocations = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripWrapper).filter(Boolean);
  }

  const rawValue = String(value || "").trim();

  if (!rawValue) return [];

  const cleanedValue = stripWrapper(rawValue);

  if (!cleanedValue) return [];

  if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
    return cleanedValue.split(",").map(stripWrapper).filter(Boolean);
  }

  if (cleanedValue.includes(",")) {
    return cleanedValue.split(",").map(stripWrapper).filter(Boolean);
  }

  return [cleanedValue];
};

export const formatJobLocation = (value, limit = 2) => {
  const locations = parseJobLocations(value);
  const fullText = locations.join(", ") || DEFAULT_LOCATION_TEXT;
  const visibleLocations = locations.slice(0, limit);
  const displayText =
    visibleLocations.join(", ") +
    (locations.length > visibleLocations.length ? "..." : "");

  return {
    displayText: displayText || DEFAULT_LOCATION_TEXT,
    tooltipText: fullText,
    hasMore: locations.length > visibleLocations.length,
  };
};
