import z from "zod";

export const recipeDetails = z.object({
  name: z.string(),
  ingredients: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        part: z.string(),
        ingredients: z.array(z.string()),
      })
    ),
  ]),
  instructions: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        part: z.string(),
        instructions: z.array(z.string()),
      })
    ),
  ]),
  notes: z.string().optional(),
});

export const recipe = z.looseObject({
  category: z.string(),
  id: z.string(),
  pictures: z.array(z.string()),
  en: recipeDetails,
  fr: recipeDetails,
  it: recipeDetails,
  es: recipeDetails.optional(),
  nb: recipeDetails.optional(),
  tr: recipeDetails.optional(),
  ja: recipeDetails.optional(),
  zh: recipeDetails.optional(),
});

export const feastDetails = z.object({
  name: z.string(),
  idea: z.array(z.string()),
  menu: z.array(z.string()),
  notes: z.array(
    z.object({
      title: z.string(),
      description: z.array(z.string()),
    })
  ),
});

export const feast = z.looseObject({
  mealNumber: z.number(),
  id: z.string(),
  countryCode: z.string(),
  date: z.string(),
  ranking: z.number(),
  pictures: z.array(z.string()),
  en: feastDetails,
  fr: feastDetails.optional(),
  it: feastDetails.optional(),
  es: feastDetails.optional(),
  nb: feastDetails.optional(),
  tr: feastDetails.optional(),
  ja: feastDetails.optional(),
  zh: feastDetails.optional(),
});

export const countryType = z.object({
  capital: z.string().optional(),
  code: z.string(),
  continent: z.string().optional(),
  name: z.string(),
  flagCharacteristics: z.array(z.string()).optional(),
  threeLetterCode: z.string().optional(),
});

export type RecipeDetails = z.infer<typeof recipeDetails>;
export type Recipe = z.infer<typeof recipe>;
export type FeastDetails = z.infer<typeof feastDetails>;
export type Feast = z.infer<typeof feast>;
export type CountryType = z.infer<typeof countryType>;
