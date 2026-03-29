import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShareButtons } from "@/components/blog/share-buttons";

describe("ShareButtons", () => {
  const defaultProps = {
    title: "Test Blog Post",
    url: "https://example.com/blog/test-post",
  };

  it("renders share links", () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it("Twitter link contains encoded title and URL", () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const links = container.querySelectorAll("a");
    const twitterLink = Array.from(links).find((a) =>
      a.href.includes("twitter.com")
    );
    expect(twitterLink).toBeDefined();
    expect(twitterLink!.href).toContain(encodeURIComponent(defaultProps.title));
    expect(twitterLink!.href).toContain(encodeURIComponent(defaultProps.url));
  });

  it("LinkedIn link contains encoded URL", () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const links = container.querySelectorAll("a");
    const linkedinLink = Array.from(links).find((a) =>
      a.href.includes("linkedin.com")
    );
    expect(linkedinLink).toBeDefined();
    expect(linkedinLink!.href).toContain(encodeURIComponent(defaultProps.url));
  });

  it("copy button exists", () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
  });
});
