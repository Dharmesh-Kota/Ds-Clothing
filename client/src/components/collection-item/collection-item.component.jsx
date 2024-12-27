import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./collection-item.styles.scss";

import CustomButton from "../custom-button/custom-button.component";

import { addItem } from "../../redux/cart/cart.reducer";
import { selectCurrentUser } from "../../redux/user/user.selector";

import { addItemToFirestore } from "../../firebase/firebase.utils";

const CollectionItem = ({ item }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const handleAddItem = (item) => {
    dispatch(addItem(item));
    if (!!currentUser) {
      addItemToFirestore(currentUser.id, item);
    }
  };

  return (
    <div className="collection-item">
      <div
        className="image"
        style={{
          backgroundImage: `url(${item.imageUrl})`,
        }}
      />
      <div className="collection-footer">
        <span className="name">{item.name}</span>
        <span className="price">{item.price}</span>
      </div>
      <CustomButton onClick={() => handleAddItem(item)} inverted>
        {" "}
        Add to Cart{" "}
      </CustomButton>
    </div>
  );
};

export default CollectionItem;
