import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Checkout from "./checkout.component";
import { selectCartItems, selectCartTotal } from "../../redux/cart/cart.selectors";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("../../components/checkout-item/checkout-item.component", () => (props) => (
  <div data-testid="checkout-item">{JSON.stringify(props.item)}</div>
));

jest.mock("../../components/stripe-button/stripe-button.component", () => (props) => (
  <button data-testid="stripe-button">Pay ${props.price}</button>
));

describe("Checkout Component", () => {
  const mockCartItems = [
    { id: 1, name: "Item 1", price: 100, quantity: 2 },
    { id: 2, name: "Item 2", price: 50, quantity: 1 },
  ];

  const mockTotal = 250;

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-redux").useSelector.mockImplementation((selector) => {
      if (selector === selectCartItems) return mockCartItems;
      if (selector === selectCartTotal) return mockTotal;
      return undefined;
    });
  });

  it("renders the checkout header correctly", () => {
    renderWithProviders(<Checkout />);

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("renders the cart items correctly", () => {
    renderWithProviders(<Checkout />);

    const checkoutItems = screen.getAllByTestId("checkout-item");
    expect(checkoutItems.length).toBe(mockCartItems.length);

    expect(checkoutItems[0]).toHaveTextContent('"name":"Item 1"');
    expect(checkoutItems[1]).toHaveTextContent('"name":"Item 2"');
  });

  it("displays the total correctly", () => {
    renderWithProviders(<Checkout />);

    expect(screen.getByText(`TOTAL: ${mockTotal}`)).toBeInTheDocument();
  });

  it("renders the payment instructions", () => {
    renderWithProviders(<Checkout />);

    expect(screen.getByText(/Please use the following test credit card for payments:/i)).toBeInTheDocument();
    expect(screen.getByText(/4242 4242 4242 4242/i)).toBeInTheDocument();
  });

  it("renders the StripeCheckoutButton with the correct price", () => {
    renderWithProviders(<Checkout />);

    const stripeButton = screen.getByTestId("stripe-button");
    expect(stripeButton).toHaveTextContent(`Pay $${mockTotal}`);
  });
});
