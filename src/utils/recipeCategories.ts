export const categories = [
  "feasts",
  "starters",
  "mainCourses",
  "desserts",
  "breads",
  "dips",
] as const;

export type RecipeCategory = (typeof categories)[number];

export const categoryEmoji = (tab: string): string => {
  switch (tab) {
    case "home":
      return "🏠";
    case "feasts":
      return "🍽️";
    case "starters":
      return "🥗";
    case "mainCourses":
      return "🍝";
    case "desserts":
      return "🍰";
    case "breads":
      return "🥖";
    case "dips":
      return "🥣";
    default:
      return "";
  }
};
