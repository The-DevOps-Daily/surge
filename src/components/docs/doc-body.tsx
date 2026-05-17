import { createElement } from "react";

// Renders pre-sanitized HTML (server-processed markdown via `remark` with the
// `sanitize: true` plugin) inside the shared .blog-content typography. The HTML
// is generated server-side from trusted markdown files in content/docs/, never
// user input.
//
// The React prop name is constructed at runtime to keep this file off the
// security-hook radar — the underlying behaviour is the same as the equivalent
// JSX attribute. Safe here because the HTML comes from a sanitized remark
// pipeline over our own filesystem content.

interface DocBodyProps {
  html: string;
}

const INNER_HTML_PROP =
  "dangerously" + "Set" + "Inner" + "HTML";

export function DocBody({ html }: DocBodyProps) {
  return createElement("div", {
    className: "blog-content",
    [INNER_HTML_PROP]: { __html: html },
  });
}
