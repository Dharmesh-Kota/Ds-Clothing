import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import * as reactRouterDom from "react-router-dom";

import CollectionPreview from "./collection-preview.component";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const initialState = {
  user: {
    currentUser: {
      displayName: "demo user",
      email: "demouser@gmail.com",
      id: "1",
    },
  },
};

const mockProps = {
  title: "title",
  items: [
    {
      id: 2,
      imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
      name: "Blue-Beanie",
      price: 18,
    },
  ],
};

it("displays the title and passes down the items correctly", () => {
  renderWithProviders(
    <CollectionPreview title={mockProps.title} items={mockProps.items} />,
    initialState
  );

  expect(screen.getByText("TITLE")).toBeInTheDocument();
  expect(screen.getByText("Blue-Beanie")).toBeInTheDocument();
});

it("navigates to the proper collection page", () => {
  const mockNavigate = jest.fn();
  reactRouterDom.useNavigate.mockReturnValue(mockNavigate);

  renderWithProviders(
    <CollectionPreview title={mockProps.title} items={mockProps.items} />,
    initialState
  );

  const titleButton = screen.getByRole("heading", { level: 1 });
  userEvent.click(titleButton);

  expect(mockNavigate).toHaveBeenCalledWith("title");
});
