import { describe, expect, it } from "vitest";
import { seedState } from "../data/seed";
import { markGrowthStatus } from "./actions";
import { growthFocus, neverTriedGrowth } from "./selectors";

describe("growth curation", () => {
  it("selects an untried growth capture as focus", () => {
    expect(growthFocus(seedState)?.id).toBe("c4");
  });

  it("removes tried item from focus", () => {
    const next = markGrowthStatus(seedState, "c4", "tried");
    expect(growthFocus(next)?.id).not.toBe("c4");
  });

  it("tracks never-tried growth captures", () => {
    expect(neverTriedGrowth(seedState).map((capture) => capture.id)).toContain("c4");
  });
});
