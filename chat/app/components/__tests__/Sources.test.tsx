import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Sources } from "../Sources.tsx";

beforeEach(() => {
  window.history.replaceState(null, "", "/getting_started/overview");
});

describe("Sources", () => {
  it("renders nothing when there are no sources", () => {
    const { container } = render(<Sources sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses the singular label for one source", () => {
    render(<Sources sources={[{ title: "Overview", href: "/getting_started/overview" }]} />);
    expect(screen.getByText(/1 source/)).toBeInTheDocument();
    expect(screen.queryByText(/1 sources/)).not.toBeInTheDocument();
  });

  it("counts several sources and localizes each docs link on this origin", () => {
    render(
      <Sources
        sources={[
          {
            title: "Hybrid search",
            href: "/capabilities/hybrid_search/overview#configure",
            breadcrumb: "Capabilities",
          },
          { title: "Search", href: "/reference/api/search" },
        ]}
      />,
    );

    expect(screen.getByText(/2 sources/)).toBeInTheDocument();
    expect(screen.getByText("Capabilities")).toBeInTheDocument();

    const hybrid = screen.getByRole("link", { name: /Hybrid search/ });
    expect(hybrid).toHaveAttribute(
      "href",
      `${window.location.origin}/capabilities/hybrid_search/overview#configure`,
    );
    expect(hybrid).toHaveAttribute("target", "_self");
    expect(screen.getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      `${window.location.origin}/reference/api/search`,
    );
  });
});
