const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase("nb-NO").replace(/\s+/g, " ");

const withoutInfinitiveMarker = (value: string): string =>
  value.replace(/^å\s+/i, "");

export const acceptedNorwegianQuizAnswers = (value: string): string[] => {
  const answers = value
    .split(/\s*[,/]\s*/)
    .flatMap((alternative) => {
      const optionalSuffix = alternative.match(/^(.*)\(([^\s()])\)$/);
      if (optionalSuffix) {
        return [optionalSuffix[1], `${optionalSuffix[1]}${optionalSuffix[2]}`];
      }

      return [
        alternative.replace(/\s*\((?:en|ei|et)\)\s*$/i, ""),
        alternative.replace(/\s*\([^)]*\)\s*$/i, ""),
      ];
    })
    .flatMap((alternative) => [
      normalize(alternative),
      normalize(withoutInfinitiveMarker(alternative)),
    ])
    .filter(Boolean);

  return [...new Set(answers)];
};

export const isNorwegianQuizAnswerCorrect = (
  answer: string,
  expected: string,
): boolean => {
  const normalizedAnswer = normalize(answer);
  if (!normalizedAnswer) return false;

  return acceptedNorwegianQuizAnswers(expected).includes(normalizedAnswer);
};
