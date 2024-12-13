import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import CollectionsOverviewContainer from "../../components/collections-overview/collections-overview.container";
import CollectionPageContainer from "../collection/collection.container";
import { fetchCollections } from "../../redux/shop/shop.reducer"

const ShopPage = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  return (
    <div>
        <Routes>
          <Route
            path="/"
            element={<CollectionsOverviewContainer />}
          />
          <Route
            path=":collectionId"
            element={<CollectionPageContainer />}
          />
        </Routes>
    </div>
  );
};

export default ShopPage;