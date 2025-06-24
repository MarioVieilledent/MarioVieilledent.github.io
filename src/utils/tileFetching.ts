type TileKey = string; // e.g., "12/2048/1360"

export class TileManager {
  private cache: Map<TileKey, HTMLImageElement> = new Map();
  private tileUrlFn: (z: number, x: number, y: number) => string;

  constructor(tileUrlFn: (z: number, x: number, y: number) => string) {
    this.tileUrlFn = tileUrlFn;
  }

  getTileKey(z: number, x: number, y: number): TileKey {
    return `${z}/${x}/${y}`;
  }

  async loadTile(z: number, x: number, y: number): Promise<HTMLImageElement> {
    const key = this.getTileKey(z, x, y);

    // Check cache
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Fetch tile
    const url = this.tileUrlFn(z, x, y);
    const image = await this.loadImage(url);

    // Store in cache
    this.cache.set(key, image);

    return image;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  hasTile(z: number, x: number, y: number): boolean {
    return this.cache.has(this.getTileKey(z, x, y));
  }

  getTile(z: number, x: number, y: number): HTMLImageElement | undefined {
    return this.cache.get(this.getTileKey(z, x, y));
  }

  clear(): void {
    this.cache.clear();
  }

  // Optional: limit cache size, implement LRU etc.
}
