import shopReducer, {
  fetchCollections,
  updateCollections,
} from "./shop.reducer";
import { collection, getDocs } from "firebase/firestore";
import { convertCollectionsSnapshotToMap } from "../../firebase/firebase.utils";

jest.mock("../../firebase/firebase.utils", () => ({
  firestore: "mockFirestore",
  convertCollectionsSnapshotToMap: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe("Shop Slice", () => {
  const initialState = {
    collections: null,
    isFetching: false,
    errorMessage: null,
  };

  it("should handle the initial state", () => {
    expect(shopReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle updateCollections", () => {
    const newCollections = [{ id: 1, title: "Hats" }];
    const action = updateCollections(newCollections);

    const expectedState = {
      ...initialState,
      collections: newCollections,
    };

    expect(shopReducer(initialState, action)).toEqual(expectedState);
  });

  describe("fetchCollections async thunk", () => {
    let store;
    beforeEach(() => {
      store = {
        getState: jest.fn(() => ({ shop: initialState })),
        dispatch: jest.fn(),
      };
    });

    it("should handle fetchCollections.pending", () => {
      const action = { type: fetchCollections.pending.type };
      const expectedState = {
        ...initialState,
        isFetching: true,
        errorMessage: null,
      };

      expect(shopReducer(initialState, action)).toEqual(expectedState);
    });

    it("should handle fetchCollections.fulfilled", () => {
      const mockCollectionsMap = [{ id: 1, title: "Hats" }];
      const action = {
        type: fetchCollections.fulfilled.type,
        payload: mockCollectionsMap,
      };

      const expectedState = {
        ...initialState,
        isFetching: false,
        collections: mockCollectionsMap,
      };

      expect(shopReducer(initialState, action)).toEqual(expectedState);
    });

    it("should handle fetchCollections.rejected", () => {
      const mockErrorMessage = "Failed to fetch collections";
      const action = {
        type: fetchCollections.rejected.type,
        payload: mockErrorMessage,
      };

      const expectedState = {
        ...initialState,
        isFetching: false,
        error: mockErrorMessage,
      };

      expect(shopReducer(initialState, action)).toEqual(expectedState);
    });

    it("should dispatch fetchCollections thunk correctly", async () => {
      const mockSnapshot = {
        docs: [
          { data: () => ({ id: 1, title: "Hats" }) },
          { data: () => ({ id: 2, title: "Sneakers" }) },
        ],
      };
      const mockCollectionsMap = [
        { id: 1, title: "Hats" },
        { id: 2, title: "Sneakers" },
      ];

      collection.mockReturnValue("mockCollectionRef");
      getDocs.mockResolvedValue(mockSnapshot);
      convertCollectionsSnapshotToMap.mockReturnValue(mockCollectionsMap);

      const result = await fetchCollections()(
        store.dispatch,
        store.getState,
        undefined
      );

      expect(result.payload).toEqual(mockCollectionsMap);
      expect(collection).toHaveBeenCalledWith('mockFirestore', 'collections');
      expect(getDocs).toHaveBeenCalledWith("mockCollectionRef");
      expect(convertCollectionsSnapshotToMap).toHaveBeenCalledWith(
        mockSnapshot
      );
    });

    it("should handle fetchCollections thunk error", async () => {
      const mockError = "Fetch error";
      getDocs.mockRejectedValue(new Error(mockError));

      const result = await fetchCollections()(
        store.dispatch,
        store.getState,
        undefined
      );

      expect(result.payload).toBe(mockError);

      expect(result.error.message).toBe("Rejected");
    });
  });
});
