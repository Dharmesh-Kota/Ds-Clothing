import { createSelector } from "reselect";

// Input Selector
const selectCart = (state) => state.cart;

// Output selectors
export const selectCartItems = createSelector(
  [selectCart], 
  (cart) => Object.values(cart.cartItems)
);

export const selectCartItemsObject = createSelector(
  [selectCart], 
  (cart) => cart.cartItems
);

export const selectCartHidden = createSelector(
  [selectCart],
  (cart) => cart.hidden
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (cartItems) =>
    Object.values(cartItems).reduce(
      (accumulatedQuantity, cartItem) =>
        accumulatedQuantity + cartItem.quantity,
      0
    )
);

export const selectCartTotal = createSelector([selectCartItems], (cartItems) =>
  Object.values(cartItems).reduce(
    (accumulatedPrice, cartItem) =>
      accumulatedPrice + cartItem.quantity * cartItem.price,
    0
  )
);
