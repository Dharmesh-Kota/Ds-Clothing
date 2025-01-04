import React from "react";
import { renderWithProviders } from "../../test-utils";
import { selectCollection } from "../../redux/shop/shop.selector";

import CollectionPage from "./collection.component";

jest.mock("../../redux/shop/shop.selector", () => ({
  selectCollection: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock("../../components/collection-item/collection-item.component", () => (props) => (
  <div data-testid="collection-item">{props.item.name}</div>
));

describe("CollectionPage Component", () => {
  const mockCollection = {
    id: 1,
    title: "Hats",
    items: [
      { id: 1, name: "Brown Hat", price: 25 },
      { id: 2, name: "Black Hat", price: 30 },
    ],
  };

  beforeEach(() => {
    selectCollection.mockReturnValue(() => mockCollection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the collection title and items correctly", () => {
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
          hats: mockCollection,
        },
      },
    };

    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ collectionId: 'hats' });

    const { getByText, getAllByTestId } = renderWithProviders(
      <CollectionPage />,
      initialState,
      "/shop/hats"
    );

    expect(getByText("Hats")).toBeInTheDocument();

    const items = getAllByTestId("collection-item");
    expect(items.length).toBe(mockCollection.items.length);
    expect(getByText("Brown Hat")).toBeInTheDocument();
    expect(getByText("Black Hat")).toBeInTheDocument();
  });

  it("does not crash if collection is null", () => {
    selectCollection.mockReturnValue(() => null);

    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ collectionId: 'hats' });

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
          hats: null,
        },
      },
    };

    const { queryByText, queryAllByTestId } = renderWithProviders(
      <CollectionPage />,
      initialState,
      "/shop/hats"
    );

    expect(queryByText("Hats")).not.toBeInTheDocument();
    expect(queryAllByTestId("collection-item").length).toBe(0);
  });

  it("selectCollection is called with the correct collectionId", () => {
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
          hats: mockCollection,
        },
      },
    };

    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ collectionId: 'hats' });

    renderWithProviders(<CollectionPage />, initialState);

    expect(selectCollection).toHaveBeenCalledWith("hats");
  });
});
