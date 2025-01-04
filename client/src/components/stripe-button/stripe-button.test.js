import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import axios from "axios";
import userEvent from "@testing-library/user-event";

import StripCheckoutButton from "./stripe-button.component";

jest.mock("axios");

jest.mock("react-stripe-checkout", () => {
  return function MockStripeCheckout({ token }) {
    return (
      <button onClick={() => token({ id: "mock-token-id" })}>Pay Now</button>
    );
  };
});

const INITIAL_STATE = {
  user: {
    currentUser: {
      displayName: "demo user",
      email: "demouser@gmail.com",
      id: "1",
    },
  },
};

const MOCK_PRICE = 100;
const MOCK_TOKEN = { id: "mock-token-id" };
const MOCK_PAYMENT_DATA = {
  url: "api/payment",
  method: "post",
  data: {
    amount: MOCK_PRICE * 100,
    token: MOCK_TOKEN,
  },
};

// Helper Function
const renderComponent = (state = INITIAL_STATE) => {
  renderWithProviders(<StripCheckoutButton price={MOCK_PRICE} />, state);
};

describe("StripeCheckoutButton Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the button correctly", () => {
    renderComponent();

    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });

  it("renders a login prompt when the user is not logged in", () => {
    renderComponent({ user: { currentUser: null } });

    expect(
      screen.getByText("Please log in to proceed with payment!")
    ).toBeInTheDocument();
  });

  it("dispatches the API call correctly when clicked", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    axios.mockResolvedValue({ data: "Payment Successful" });

    renderComponent();

    const button = screen.getByText("Pay Now");
    userEvent.click(button);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Payment Successful!");
    });

    expect(axios).toHaveBeenCalledWith(MOCK_PAYMENT_DATA);

    alertMock.mockRestore();
  });

  it("handles API call failure correctly when clicked", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    axios.mockRejectedValue(new Error("Payment failed"));

    renderComponent();

    const button = screen.getByText("Pay Now");
    userEvent.click(button);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        "There was an issue with your payment. Please make sure you use the provided credentials!"
      );
    });

    expect(axios).toHaveBeenCalledWith(MOCK_PAYMENT_DATA);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Payment error: ",
      expect.anything()
    );

    alertMock.mockRestore();
    consoleSpy.mockRestore();
  });
});
