import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils";

import SignIn from "./sign-in.component";
import { signInWithGoogle } from "../../firebase/firebase.utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.utils";

jest.mock("../../firebase/firebase.utils", () => ({
  signInWithGoogle: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the SignIn component correctly", () => {
    renderWithProviders(<SignIn />);

    expect(screen.getByText("I already have an account")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in with your email and password")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("SIGN IN")).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("updates email and password inputs on change", () => {
    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls signInWithEmailAndPassword on form submit", async () => {
    signInWithEmailAndPassword.mockResolvedValue();

    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const form = screen.getByRole("form");

    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "password123");

    fireEvent.submit(form);

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "test@test.com",
      "password123"
    );
  });

  it("calls signInWithGoogle when 'Sign in with Google' button is clicked", () => {
    renderWithProviders(<SignIn />);

    const googleSignInButton = screen.getByText("Sign in with Google");
    fireEvent.click(googleSignInButton);

    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it("clears input fields after successful form submission", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});

    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const form = screen.getByRole("form");

    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@test.com");
    expect(passwordInput.value).toBe("password123");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });
  });

  it("logs an error message on failed sign-in", async () => {
    const mockError = new Error("Invalid credentials");
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    signInWithEmailAndPassword.mockRejectedValueOnce(mockError);

    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const form = screen.getByRole("form");

    userEvent.type(emailInput, "test@test.com");
    userEvent.type(passwordInput, "password123");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error creating user: ",
        mockError.message
      );
    });

    consoleSpy.mockRestore();
  });

  it("requires all fields to be filled before signing in with Email and Password", async () => {
    renderWithProviders(<SignIn />);

    const submitButton = screen.getByText("SIGN IN");
    await userEvent.click(submitButton);

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });
});
