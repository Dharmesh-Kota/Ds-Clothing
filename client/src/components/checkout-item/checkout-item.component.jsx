import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./checkout-item.styles.scss";

import {
  addItemToFirestore,
  removeItemFromFirestore,
  clearItemFromFirestore,
} from "../../firebase/firebase.utils";
import { clearItem, addItem, removeItem } from "../../redux/cart/cart.reducer";
import { selectCurrentUser } from "../../redux/user/user.selector";

const CheckoutItem = ({ item }) => {
  const { imageUrl, name, price, quantity } = item;
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
    if (currentUser) {
      removeItemFromFirestore(currentUser.id, item.id);
    }
  };
  const handleAddItem = (item) => {
    dispatch(addItem(item));
    if (currentUser) {
      addItemToFirestore(currentUser.id, item);
    }
  };
  const handleClearItem = (item) => {
    dispatch(clearItem(item));
    if (currentUser) {
      clearItemFromFirestore(currentUser.id, item.id);
    }
  };

  return (
    <div className="checkout-item">
      <div className="image-container">
        <img alt="item" src={imageUrl} />
      </div>
      <span className="name">{name}</span>
      <span className="quantity">
        <div className="arrow" onClick={() => handleRemoveItem(item)}>
          &#10094;
        </div>
        <span className="value">{quantity}</span>
        <div className="arrow" onClick={() => handleAddItem(item)}>
          &#10095;
        </div>
      </span>
      <span className="price">{price}</span>
      <span className="remove-button" onClick={() => handleClearItem(item)}>
        &#10005;
      </span>
    </div>
  );
};

export default CheckoutItem;
