import React from "react";
import { useSelector } from "react-redux";

import './cart-dropdown.styles.scss';

import CustomButton from '../custom-button/custom-button.component';
import CartDropdownItem from '../cart-item/cart-item.component';
import { selectCartItems } from "../../redux/cart/cart.selectors";

const CartDropdown = () => {
    
    const cartItems = useSelector(selectCartItems);

    return (
        <div className="cart-dropdown">
            <div className="cart-items">
                {
                    cartItems.map((item) => <CartDropdownItem key={item.id} item={item}/>)
                }
            </div>
            <CustomButton>GO TO CHECKOUT</CustomButton>
        </div>
    )
}

export default CartDropdown;