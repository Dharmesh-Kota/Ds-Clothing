import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom'
import { collection } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { firestore, convertCollectionsSnapshotToMap } from "../../firebase/firebase.utils";
import { onSnapshot } from "firebase/firestore";
import { updateCollections } from '../../redux/shop/shop.reducer';

import CollectionsOverview from "../../components/collections-overview/collections-overview.component";
import CollectionPage from "../collection/collection.component";

const ShopPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const collectionRef = collection(firestore, 'collections');
        const unsubscribeFromSnapshot = onSnapshot(collectionRef, async (snapshot) => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            dispatch(updateCollections(collectionsMap));
        });

    }, [dispatch]);

    return (
        <div>
            <Routes>
                <Route path={"/"} element={<CollectionsOverview />} />
                <Route path={":collectionId"} element={<CollectionPage />} />
            </Routes>
        </div>
    )
};

export default ShopPage;