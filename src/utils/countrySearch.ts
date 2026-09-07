import type { CountryType } from "./validator";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

const subsequenceGap = (query: string, candidate: string) => {
  let queryIndex = 0;
  let firstMatch = -1;
  let lastMatch = -1;

  for (
    let candidateIndex = 0;
    candidateIndex < candidate.length && queryIndex < query.length;
    candidateIndex += 1
  ) {
    if (candidate[candidateIndex] === query[queryIndex]) {
      if (firstMatch === -1) firstMatch = candidateIndex;
      lastMatch = candidateIndex;
      queryIndex += 1;
    }
  }

  return queryIndex === query.length ? lastMatch - firstMatch + 1 - query.length : null;
};

const scoreValue = (query: string, value: string) => {
  const candidate = normalize(value);
  if (!query) return 0;
  if (candidate === query) return 0;
  if (candidate.startsWith(query)) return 1 + (candidate.length - query.length) / 100;
  const containedAt = candidate.indexOf(query);
  if (containedAt >= 0) return 3 + containedAt + (candidate.length - query.length) / 100;

  const gap = subsequenceGap(query, candidate);
  if (gap !== null && gap <= Math.max(3, Math.floor(query.length / 2))) {
    return 20 + gap + candidate.length / 100;
  }

  const distance = editDistance(query, candidate);
  const allowedDistance = query.length <= 4 ? 1 : query.length <= 8 ? 2 : 3;
  return distance <= allowedDistance ? 40 + distance : null;
};

export const searchCountries = <T extends CountryType>(
  countries: T[],
  rawQuery: string,
): T[] => {
  const query = normalize(rawQuery);
  if (!query) return countries;

  return countries
    .map((country) => {
      const values = [
        country.name,
        country.capital,
        country.code,
        country.threeLetterCode,
      ].filter((value): value is string => Boolean(value));
      const scores = values
        .map((value) => scoreValue(query, value))
        .filter((score): score is number => score !== null);

      return { country, score: scores.length > 0 ? Math.min(...scores) : null };
    })
    .filter(
      (result): result is { country: T; score: number } =>
        result.score !== null,
    )
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.country.name.localeCompare(right.country.name),
    )
    .map(({ country }) => country);
};

export const normalizeCountryAnswer = normalize;
