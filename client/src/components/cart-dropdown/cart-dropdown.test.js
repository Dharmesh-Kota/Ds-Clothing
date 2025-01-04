import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as reactRouterDom from "react-router-dom";
import { useSelector } from "react-redux";

import CartDropdown from "./cart-dropdown.component";
import { renderWithProviders } from "../../test-utils";
import { toggleCartHidden } from "../../redux/cart/cart.reducer";

const initialState = {
  cart: {
    cartItems: {
      item1: {
        id: 1,
        imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
        name: "Blue-Beanie",
        price: 18,
        quantity: 2,
      },
      item2: {
        id: 2,
        imageUrl: "https://i.ibb.co/s96FpdP/brown-shearling.png",
        name: "Brown Shearling",
        price: 165,
        quantity: 1,
      },
    },
    hidden: false,
  },
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

it("loads and displays the cart items correctly", () => {
  const { store } = renderWithProviders(<CartDropdown />, initialState);

  expect(screen.getByText("Blue-Beanie")).toBeInTheDocument();
  expect(screen.getByText("Brown Shearling")).toBeInTheDocument();
  expect(Object.keys(store.getState().cart.cartItems)).toHaveLength(2);

  const button = screen.getByText("GO TO CHECKOUT");
  expect(button).toBeInTheDocument();
});

it("should render empty message when cart is empty", () => {
  const emptyState = {
    cart: {
      hidden: true,
      cartItems: {},
    },
  };

  renderWithProviders(<CartDropdown />, emptyState);

  expect(screen.getByText("Your cart is empty!")).toBeInTheDocument();
});

it("navigates to checkout page and dispatches toggleCartHidden on button click", () => {
  const mockNavigate = jest.fn(); 
  reactRouterDom.useNavigate.mockReturnValue(mockNavigate); 

  const { store } = renderWithProviders(<CartDropdown />, initialState);

  const button = screen.getByText("GO TO CHECKOUT");
  userEvent.click(button);

  expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  const actions = store.getActions();
  expect(actions).toContainEqual(toggleCartHidden());
});