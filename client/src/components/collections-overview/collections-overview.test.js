import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";

import CollectionsOverview from "./collections-overview.component";

const initialState = {
  user: {
    currentUser: {
      displayName: "demo user",
      email: "demouser@gmail.com",
      id: "1",
    },
  },
  shop: {
    collections: {
      title: {
        title: "title",
        items: [
          {
            id: 2,
            imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
            name: "Blue-Beanie",
            price: 18,
          },
        ],
        id: 1
      },
    },
  },
};

it("gets the collections and passes them down properly", () => {
  renderWithProviders(<CollectionsOverview />, initialState);

  expect(screen.getByText("TITLE")).toBeInTheDocument();
  expect(screen.getByText("Blue-Beanie")).toBeInTheDocument();
});
