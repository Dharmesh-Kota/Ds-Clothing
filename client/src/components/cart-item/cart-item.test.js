import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";

import CartItem from "./cart-item.component";

it("displays the cart item correctly", () => {
  const item = {
    id: 1,
    imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
    name: "Blue-Beanie",
    price: 18,
    quantity: 2,
  };

  renderWithProviders(<CartItem item={item} />);

  expect(screen.getByText("Blue-Beanie")).toBeInTheDocument();
  expect(
    screen.getByText(`${item.quantity} x \$${item.price}`)
  ).toBeInTheDocument();

  const image = screen.getByAltText(item.name);
  expect(image).toBeInTheDocument();
  expect(image).toHaveAttribute("src", item.imageUrl);
});
