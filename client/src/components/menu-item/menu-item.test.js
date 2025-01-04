import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import * as reactRouterDom from "react-router-dom";

import MenuItem from "./menu-item.component";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockItem = {
  title: "title",
  imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
  id: 1,
  linkUrl: "shop/title",
};

it("renders the menu item correctly", () => {
  renderWithProviders(<MenuItem {...mockItem} />);

  expect(screen.getByText("TITLE")).toBeInTheDocument();
  expect(screen.getByText("SHOP NOW")).toBeInTheDocument();

  const imageDiv = screen.getByTestId("background-image");
  expect(imageDiv).toHaveStyle(`backgroundImage: url(${mockItem.imageUrl})`);
});

it("navigates to the correct collections page", () => {
  jest
    .spyOn(reactRouterDom, "useLocation")
    .mockReturnValue({ pathname: "/base/" });

  const mockNavigate = jest.fn();
  reactRouterDom.useNavigate.mockReturnValue(mockNavigate);

  renderWithProviders(<MenuItem {...mockItem} />);
  const button = screen.getByText("TITLE");
  userEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith("/base/shop/title");
});

it("applies the large class when size is set to large", () => {
  renderWithProviders(<MenuItem {...mockItem} size="large" />);
  const menuItem = screen.getByTestId("menu-item"); 
  expect(menuItem).toHaveClass("large");
});

it("does not apply the large class when size is not set to large", () => {
  renderWithProviders(<MenuItem {...mockItem} />);
  const menuItem = screen.getByTestId("menu-item");
  expect(menuItem).not.toHaveClass("large");
});
