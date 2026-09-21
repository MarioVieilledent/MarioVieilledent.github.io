const RESPONSIVE_WIDTHS = [640, 1280] as const;

const imageStem = (filename: string): string =>
  filename.replace(/\.[^/.]+$/, "");

export const foodImageUrl = (filename: string): string => `/food/${filename}`;

export const foodImageProps = (filename: string) => ({
  src: foodImageUrl(filename),
  srcSet: RESPONSIVE_WIDTHS.map(
    (width) => `/food/responsive/${imageStem(filename)}-${width}.webp ${width}w`,
  ).join(", "),
});

export const CARD_IMAGE_SIZES =
  "(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw";
export const HERO_IMAGE_SIZES = "(min-width: 1152px) 1152px, 100vw";
