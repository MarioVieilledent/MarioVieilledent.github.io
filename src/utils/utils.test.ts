import { describe, it, expect, vi, afterEach } from "vitest";
import { randomIndexBasedOnDate } from "./utils";

// Helper to mock Date
const mockDate = (isoDate: string) => {
  vi.setSystemTime(new Date(isoDate));
};

describe("randomIndexBasedOnDate", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the same index for the same day", () => {
    mockDate("2025-10-17T12:00:00Z");
    const first = randomIndexBasedOnDate(10);
    const second = randomIndexBasedOnDate(10);
    expect(first).toBe(second);
  });

  it("returns different indexes for different days", () => {
    mockDate("2025-10-17T12:00:00Z");
    const first = randomIndexBasedOnDate(10);

    mockDate("2025-10-18T12:00:00Z");
    const second = randomIndexBasedOnDate(10);

    expect(first).not.toBe(second);
  });

  it("handles n = 1", () => {
    mockDate("2025-10-17T12:00:00Z");
    expect(randomIndexBasedOnDate(1)).toBe(0);
  });

  it("handles large n", () => {
    mockDate("2025-10-17T12:00:00Z");
    const index = randomIndexBasedOnDate(1_000_000);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(1_000_000);
  });

  it("returns 0 if n = 0", () => {
    mockDate("2025-10-17T12:00:00Z");
    const index = randomIndexBasedOnDate(0);
    expect(index).toBe(0);
  });

  it("returns 0 if n is negative", () => {
    mockDate("2025-10-17T12:00:00Z");
    const index = randomIndexBasedOnDate(-42);
    expect(index).toBe(0);
  });
});
