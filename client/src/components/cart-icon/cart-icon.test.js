import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils";
// import "@testing-library/jest-dom";

import CartIcon from "./cart-icon.component";
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

it("displays the cart items count correctly", () => {

  renderWithProviders(<CartIcon />, initialState);

  const totalCartItems = Object.values(initialState.cart.cartItems).reduce(
    (accumulatedQuantity, item) => accumulatedQuantity + item.quantity,
    0
  );
  expect(screen.getByText(totalCartItems)).toBeInTheDocument();

});

it("dispatches the toggleCartHidden correctly when clicked", () => {

  const { store } = renderWithProviders(<CartIcon />, initialState);

  const button = screen.getByTestId("item-count");
  userEvent.click(button);

  const actions = store.getActions();
  expect(actions).toContainEqual(toggleCartHidden());

});