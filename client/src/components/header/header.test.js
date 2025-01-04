import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";

import Header from "./header.component";
import { auth } from "../../firebase/firebase.utils";
import { emptyCart } from "../../redux/cart/cart.reducer";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
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
    cartItems: {},
    hidden: true,
  },
};

jest.mock("../../firebase/firebase.utils.js", () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

it("renders the header correctly and shows all the navigations for logged-in user", () => {
  renderWithProviders(<Header />, initialState);

  expect(screen.getByText("SHOP")).toBeInTheDocument();
  expect(screen.getByText("CONTACT")).toBeInTheDocument();
  expect(screen.getByText("SIGN OUT")).toBeInTheDocument();
  expect(screen.queryByText("Your cart is empty!")).not.toBeInTheDocument();
});

it("renders the header correctly and shows all the navigations for visiting user", () => {
  renderWithProviders(<Header />, {
    user: { currentUser: null },
    cart: { hidden: true, cartItems: {} },
  });

  expect(screen.getByText("SHOP")).toBeInTheDocument();
  expect(screen.getByText("CONTACT")).toBeInTheDocument();
  expect(screen.getByText("SIGN IN")).toBeInTheDocument();
  expect(screen.queryByText("Your cart is empty!")).not.toBeInTheDocument();
});

it("shows the Cart Dropdown when hidden is set to false", () => {
  renderWithProviders(<Header />, {
    user: { currentUser: null },
    cart: { hidden: false, cartItems: {} },
  });

  expect(screen.getByText("Your cart is empty!")).toBeInTheDocument();
});

it("dispatches the emptyCart action correctly when clicked sign-out", async () => {
  auth.signOut.mockResolvedValue();

  const { store } = renderWithProviders(<Header />, initialState);

  const signOutButton = screen.getByText("SIGN OUT");
  userEvent.click(signOutButton);

  await waitFor(() => {
    const actions = store.getActions();
    expect(actions).toContainEqual(emptyCart());
  });

  expect(auth.signOut).toHaveBeenCalledTimes(1);
});

it("handles sign-out errors gracefully", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  auth.signOut.mockRejectedValue(new Error("Sign-out failed"));

  renderWithProviders(<Header />, initialState);

  const signOutButton = screen.getByText("SIGN OUT");
  userEvent.click(signOutButton);

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error signing out:",
      expect.any(Error)
    );
  });

  consoleSpy.mockRestore();
});

it("navigates to the home page when the logo is clicked", async () => {
  renderWithProviders(
    <>
      <Header />
      <LocationDisplay />
    </>,
    initialState,
    "/shop"
  );

  const logoLink = screen.getByRole("link", { name: "crown.svg" });
  userEvent.click(logoLink);

  await waitFor(() => {
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
  });
});

it("navigates to the shop page when the SHOP link is clicked", async () => {
  renderWithProviders(
    <>
      <Header />
      <LocationDisplay />
    </>,
    initialState,
    "/"
  );

  const shopLink = screen.getByText("SHOP");
  userEvent.click(shopLink);

  await waitFor(() => {
    expect(screen.getByTestId("location-display")).toHaveTextContent("/shop");
  });
});
