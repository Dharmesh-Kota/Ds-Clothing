import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import { useSelector } from "react-redux";

import "./header.styles.scss";

import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";

import { auth } from "../../firebase/firebase.utils";

const Header = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const isCartHidden = useSelector((state) => state.cart.hidden);

  return (
    <div className="header">
      <Link to={"/"} className="logo-container">
        <Logo className="logo" />
      </Link>
      <div className="options">
        <Link to={"/shop"} className="option">
          SHOP
        </Link>
        <Link to={"/contact"} className="contact">
          CONTACT
        </Link>
        {currentUser ? (
          <div className="option" onClick={() => auth.signOut()}>
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