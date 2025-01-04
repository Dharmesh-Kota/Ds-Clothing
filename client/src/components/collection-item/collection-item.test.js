import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import userEvent from "@testing-library/user-event";

import CollectionItem from "./collection-item.component";
import { addItem } from "../../redux/cart/cart.reducer";
import {
  addItemToFirestore
} from "../../firebase/firebase.utils";

jest.mock("../../firebase/firebase.utils.js", () => ({
  addItemToFirestore: jest.fn(),
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
  renderWithProviders(<CollectionItem item={item} />, initialState);

  expect(screen.getByText(item.name)).toBeInTheDocument();
  expect(screen.getByText(item.price)).toBeInTheDocument();

  const imageDiv = screen.getByTestId("background-image");
  expect(imageDiv).toHaveStyle(`backgroundImage: url(${item.imageUrl})`);
});

describe("add item tests", () => {
  it("dispatches the addItem action correctly when clicked on increment arrow", () => {
    const { store } = renderWithProviders(
      <CollectionItem item={item} />,
      initialState
    );

    const incrementArrow = screen.getByTestId("add-item");
    userEvent.click(incrementArrow);

    const actions = store.getActions();
    expect(actions).toContainEqual(addItem(item));
  });

  it("calls the addItemToFirestore when a logged-in user clicks the increment arrow", () => {
    const { store } = renderWithProviders(
      <CollectionItem item={item} />,
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