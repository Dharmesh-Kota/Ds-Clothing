import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils"

import FormInput from "./form-input.component";

describe("FormInput Component", () => {
  it("renders correctly without a label", () => {
    renderWithProviders(<FormInput handleChange={jest.fn()} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByText(/form-input-label/i)).not.toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    renderWithProviders(<FormInput label="Test Label" handleChange={jest.fn()} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies 'shrink' class to label when input has a value", () => {
    renderWithProviders(<FormInput label="Test Label" handleChange={jest.fn()} value="Test" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("shrink");
  });

  it("does not apply 'shrink' class to label when input is empty", () => {
    renderWithProviders(<FormInput label="Test Label" handleChange={jest.fn()} value="" />);
    const label = screen.getByText("Test Label");
    expect(label).not.toHaveClass("shrink");
  });

  it("calls handleChange when input value changes", () => {
    const mockHandleChange = jest.fn();
    renderWithProviders(<FormInput handleChange={mockHandleChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Test Value" } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  it("passes additional props to the input element", () => {
    renderWithProviders(<FormInput handleChange={jest.fn()} placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });
});
