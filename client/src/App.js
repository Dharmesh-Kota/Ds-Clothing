import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setCurrentUser } from "./redux/user/user.reducer";
import { updateCart } from "./redux/cart/cart.reducer";
import { selectCurrentUser } from "./redux/user/user.selector";
import { selectCartItemsObject } from "./redux/cart/cart.selectors";

import "./App.css";
import Header from "./components/header/header.component";
import Spinner from "./components/spinner/spinner.component";
import ErrorBoundary from "./components/error-boundary/error-boundary.component";

import {
  auth,
  updateCartInFirestore,
} from "./firebase/firebase.utils";
import { onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { createUserProfileDocument } from "./firebase/firebase.utils";

const HomePage = lazy(() => import("./pages/homepage/homepage.component"));
const ShopPage = lazy(() => import("./pages/shop/shop.component"));
const SignInAndSignUpPage = lazy(() =>
  import("./pages/sign-in-and-sign-up/sign-in-and-sign-up.component")
);
const Checkout = lazy(() => import("./pages/checkout/checkout.component"));

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartItems = useSelector(selectCartItemsObject);

  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        onSnapshot(userRef, (snapshot) => {
          const userData = snapshot.data();

          dispatch(
            setCurrentUser({
              id: snapshot.id,
              ...userData,
              createdAt: userData.createdAt
                ? userData.createdAt.toDate().toISOString()
                : null,
            })
          );

          dispatch(updateCart(userData.cartItems));
        });

      } else {
        dispatch(setCurrentUser(null));
      }
    });

    return () => {
      unsubscribeFromAuth();
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      updateCartInFirestore(currentUser.id, cartItems);
    }
  }, [cartItems, currentUser]);

  return (
    <div>
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop/*" element={<ShopPage />} />
            <Route
              path="/sign-in"
              element={
                currentUser ? <Navigate to="/" /> : <SignInAndSignUpPage />
              }
            />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
