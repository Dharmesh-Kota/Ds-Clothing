import React from "react";
import { render, screen } from "@testing-library/react";
import WithSpinner from "./with-spinner.component";
import Spinner from "../spinner/spinner.component";

jest.mock("../spinner/spinner.component", () => () => <div data-testid="spinner">Loading...</div>);

const MockComponent = ({ text }) => <div data-testid="wrapped-component">{text}</div>;
const WrappedWithSpinner = WithSpinner(MockComponent);

describe("WithSpinner HOC", () => {
  it("renders Spinner when isLoading is true", () => {
    render(<WrappedWithSpinner isLoading={true} />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("wrapped-component")).not.toBeInTheDocument();
  });

  it("renders WrappedComponent when isLoading is false", () => {
    render(<WrappedWithSpinner isLoading={false} text="Hello, world!" />);

    expect(screen.getByTestId("wrapped-component")).toBeInTheDocument();
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

});