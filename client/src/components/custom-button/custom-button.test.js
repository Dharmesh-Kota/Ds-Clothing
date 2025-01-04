import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";

import CustomButton from "./custom-button.component";

it("shows the content in children correctly", () => {
  renderWithProviders(<CustomButton>Add to Cart</CustomButton>);
  expect(screen.getByText("Add to Cart")).toBeInTheDocument();
});

it("applies the google-sign-in class when isGoogleSignIn is true", () => {
  renderWithProviders(
    <CustomButton isGoogleSignIn>Google Sign-In</CustomButton>
  );
  const button = screen.getByText("Google Sign-In");
  expect(button).toHaveClass("google-sign-in");
});

it("applies the inverted class when inverted is true", () => {
  renderWithProviders(<CustomButton inverted>Inverted Button</CustomButton>);
  const button = screen.getByText("Inverted Button");
  expect(button).toHaveClass("inverted");
});

it("applies both google-sign-in and inverted classes when both props are true", () => {
  renderWithProviders(
    <CustomButton isGoogleSignIn inverted>
      Google Inverted
    </CustomButton>
  );
  const button = screen.getByText("Google Inverted");
  expect(button).toHaveClass("google-sign-in inverted");
});

it("passes additional props to the button element", () => {
  const handleClick = jest.fn();
  renderWithProviders(
    <CustomButton onClick={handleClick}>Click Me</CustomButton>
  );
  const button = screen.getByText("Click Me");
  button.click();
  expect(handleClick).toHaveBeenCalledTimes(1);
});
