import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils";
import SignUp from "./sign-up.component";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, createUserProfileDocument } from "../../firebase/firebase.utils";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../../firebase/firebase.utils", () => ({
  auth: {},
  createUserProfileDocument: jest.fn(),
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the SignUp component correctly", () => {
    renderWithProviders(<SignUp />);

    expect(screen.getByText("I don't have an account")).toBeInTheDocument();
    expect(
      screen.getByText("Sign up with your Email and Password")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText("SIGN UP")).toBeInTheDocument();
  });

  it("updates form inputs on change", async () => {
    renderWithProviders(<SignUp />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@test.com");
    expect(passwordInput).toHaveValue("password123");
    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("successfully creates a new user when passwords match", async () => {
    const mockUser = { uid: "123" };
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    createUserProfileDocument.mockResolvedValueOnce({});

    renderWithProviders(<SignUp />);

    await userEvent.type(screen.getByLabelText("Name"), "Test User");
    await userEvent.type(screen.getByLabelText("Email"), "test@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      "password123"
    );

    await userEvent.click(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@test.com",
        "password123"
      );
      expect(createUserProfileDocument).toHaveBeenCalledWith(mockUser, {
        displayName: "Test User",
      });
    });
  });

  it("shows alert when passwords don't match", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    renderWithProviders(<SignUp />);

    await userEvent.type(screen.getByLabelText("Name"), "Test User");
    await userEvent.type(screen.getByLabelText("Email"), "test@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      "differentpassword"
    );

    await userEvent.click(screen.getByText("SIGN UP"));

    expect(alertMock).toHaveBeenCalledWith("Passwords do not match");
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it("clears form fields after successful signup", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "123" },
    });
    createUserProfileDocument.mockResolvedValueOnce({});

    renderWithProviders(<SignUp />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    await userEvent.click(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(passwordInput).toHaveValue("");
      expect(confirmPasswordInput).toHaveValue("");
    });
  });

  it("handles signup error correctly", async () => {
    const mockError = new Error("Email already in use");
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

    renderWithProviders(<SignUp />);

    await userEvent.type(screen.getByLabelText("Name"), "Test User");
    await userEvent.type(screen.getByLabelText("Email"), "test@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(
      screen.getByLabelText("Confirm Password"),
      "password123"
    );

    await userEvent.click(screen.getByText("SIGN UP"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error creating user: ",
        mockError.message
      );
    });

    consoleSpy.mockRestore();
  });

  it("requires all fields to be filled before submission", async () => {
    renderWithProviders(<SignUp />);

    const submitButton = screen.getByText("SIGN UP");
    await userEvent.click(submitButton);

    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(createUserProfileDocument).not.toHaveBeenCalled();
  });
});
