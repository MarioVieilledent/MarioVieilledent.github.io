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

export const recipe = z.object({
  category: z.string(),
  id: z.string(),
  pictures: z.array(z.string()),
  en: recipeDetails,
  fr: recipeDetails,
  it: recipeDetails,
  no: recipeDetails.optional(),
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

export const feast = z.object({
  mealNumber: z.number(),
  id: z.string(),
  countryCode: z.string(),
  date: z.string(),
  ranking: z.number(),
  pictures: z.array(z.string()),
  en: feastDetails,
  fr: feastDetails,
  it: feastDetails,
  no: feastDetails.optional(),
});

export type RecipeDetails = z.infer<typeof recipeDetails>;
export type Recipe = z.infer<typeof recipe>;
export type FeastDetails = z.infer<typeof feastDetails>;
export type Feast = z.infer<typeof feast>;
