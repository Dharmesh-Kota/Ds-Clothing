import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import userEvent from "@testing-library/user-event";

import CheckoutItem from "./checkout-item.component";
import { addItem, removeItem, clearItem } from "../../redux/cart/cart.reducer";
import {
  addItemToFirestore,
  removeItemFromFirestore,
  clearItemFromFirestore,
} from "../../firebase/firebase.utils";



jest.mock("../../firebase/firebase.utils.js", () => ({
  addItemToFirestore: jest.fn(),
  removeItemFromFirestore: jest.fn(),
  clearItemFromFirestore: jest.fn(),
}));

const item = {
  id: 1,
  imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
  name: "Blue-Beanie",
  price: 18,
  quantity: 2,
};

const initialState = {
  user: {
    currentUser: {
      displayName: "demo user",
      email: "demouser@gmail.com",
      id: "1",
    },
  },
  cart: {
    cartItems: {
      item1: item,
    },
  },
};



it("displays the item correctly", () => {
  renderWithProviders(<CheckoutItem item={item} />, initialState);

  expect(screen.getByText(item.name)).toBeInTheDocument();
  expect(screen.getByText(item.quantity)).toBeInTheDocument();
  expect(screen.getByText(item.price)).toBeInTheDocument();

  const image = screen.getByAltText(item.name);
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute("src", item.imageUrl);
});



describe("add item tests", () => {
  it("dispatches the addItem action correctly when clicked on increment arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const incrementArrow = screen.getByTestId("add-item");
    userEvent.click(incrementArrow);

    const actions = store.getActions();
    expect(actions).toContainEqual(addItem(item));
  });

  it("calls the addItemToFirestore when a logged-in user clicks the increment arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const incrementArrow = screen.getByTestId("add-item");
    userEvent.click(incrementArrow);

    expect(addItemToFirestore).toHaveBeenCalledWith(
      initialState.user.currentUser.id,
      initialState.cart.cartItems["item1"]
    );
  });
});



describe("remove item tests", () => {
  it("dispatches the removeItem action correctly when clicked on decrement arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const decrementArrow = screen.getByTestId("remove-item");
    userEvent.click(decrementArrow);

    const actions = store.getActions();
    expect(actions).toContainEqual(removeItem(item));
  });

  it("calls the removeItemToFirestore when a logged-in user clicks the decrement arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const decrementArrow = screen.getByTestId("remove-item");
    userEvent.click(decrementArrow);

    expect(removeItemFromFirestore).toHaveBeenCalledWith(
      initialState.user.currentUser.id,
      initialState.cart.cartItems["item1"].id
    );
  });
});



describe("clear item tests", () => {
  it("dispatches the clearItem action correctly when clicked on decrement arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const clearButtom = screen.getByTestId("clear-item");
    userEvent.click(clearButtom);

    const actions = store.getActions();
    expect(actions).toContainEqual(clearItem(item));
  });

  it("calls the clearItemToFirestore when a logged-in user clicks the decrement arrow", () => {
    const { store } = renderWithProviders(
      <CheckoutItem item={item} />,
      initialState
    );

    const clearButtom = screen.getByTestId("clear-item");
    userEvent.click(clearButtom);

    expect(clearItemFromFirestore).toHaveBeenCalledWith(
      initialState.user.currentUser.id,
      initialState.cart.cartItems["item1"].id
    );
  });
});