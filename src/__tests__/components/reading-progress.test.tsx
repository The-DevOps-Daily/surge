import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ReadingProgress } from "@/components/blog/reading-progress";

describe("ReadingProgress", () => {
  it("renders without crashing", () => {
    const { container } = render(<ReadingProgress />);
    expect(container).toBeDefined();
  });

  it("renders a progress bar element", () => {
    const { container } = render(<ReadingProgress />);
    // The outer div is fixed at top, inner div is the progress bar
    const outerDiv = container.firstElementChild as HTMLElement;
    expect(outerDiv).not.toBeNull();
    expect(outerDiv.className).toContain("fixed");
    expect(outerDiv.className).toContain("top-0");

    const progressBar = outerDiv.firstElementChild as HTMLElement;
    expect(progressBar).not.toBeNull();
    expect(progressBar.className).toContain("bg-gradient-to-r");
    // Initially progress should be 0%
    expect(progressBar.style.width).toBe("0%");
  });
});
