import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";

import Directory from "./directory.component";

const initialState = {
  directory: {
    sections: [
      {
        title: "hats",
        imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
        id: 1,
        linkUrl: "shop/hats",
      },
    ],
  },
};

it("renders the component correctly", () => {
  renderWithProviders(<Directory />, initialState);

  expect(screen.getByText("HATS")).toBeInTheDocument();
});
