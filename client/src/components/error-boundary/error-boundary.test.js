import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils"

import ErrorBoundary from "./error-boundary.component";

// A mock component to simulate throwing of errors
const ProblemChild = () => {
  throw new Error("Problem Child Error");
};

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    renderWithProviders(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("renders fallback UI when an error occurs", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("displays the error image when an error occurs", () => {
    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    const errorImageContainer = screen.getByTestId("error-image");
    expect(errorImageContainer).toBeInTheDocument();
  });

  it("calls componentDidCatch with the correct arguments", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledTimes(1); 
    consoleSpy.mockRestore();
  });
});