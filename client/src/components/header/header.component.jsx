import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import { useSelector, useDispatch } from "react-redux";

import "./header.styles.scss";

import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";

import { auth } from "../../firebase/firebase.utils";
import { emptyCart } from "../../redux/cart/cart.reducer";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { selectCartHidden } from "../../redux/cart/cart.selectors";

const Header = () => {
  
  const currentUser = useSelector(selectCurrentUser);
  const isCartHidden = useSelector(selectCartHidden);

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(emptyCart());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="header">
      <Link to={"/"} className="logo-container">
        <Logo className="logo" />
      </Link>
      <div className="options">
        <Link to={"/shop"} className="option">
          SHOP
        </Link>
        <Link to={"/contact"} className="option">
          CONTACT
        </Link>
        {currentUser ? (
          <div className="option" onClick={() => handleSignOut()}>
            SIGN OUT
          </div>
        ) : (
          <Link to={"/sign-in"} className="option">
            SIGN IN
          </Link>
        )}
        <CartIcon />
      </div>
      {isCartHidden ? null : <CartDropdown />}
    </div>
  );
};

export default Header;