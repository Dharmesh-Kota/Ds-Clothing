import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios"
import { useSelector } from 'react-redux';

import "./stripe-button.styles.scss"

import { selectCurrentUser } from "../../redux/user/user.selector";

const StripCheckoutButton = ({ price }) => {
  const priceForStripe = price * 100; //Stripe always takes price in cents
  const publishableKey =
    "pk_test_51QG9CSLb8tcdctYnCoPPKuccNrKERFJKXzz1axm7zGqR6NSZUvB0vd408Rkddo1q4oOhk5Ir7SXXSXeIivfAW87e00kr2mpzke";

  const isUserLoggedIn = !!useSelector(selectCurrentUser);

  const onToken = (token) => {
    axios({
      url: 'api/payment',
      method: 'post',
      data: {
        amount: priceForStripe,
        token: token
      }
    }).then(response => {
      alert('Payment Successful!');
    }).catch(error => {
      console.log('Payment error: ', JSON.parse(error));

      alert('There was an issue with your payment. Please make sure you use the provided credentials!');
    });
  };

  const handleClosed = () => {
    console.log("Hii");
  }

  return (
    isUserLoggedIn ? (
    <StripeCheckout
      name="Ds Clothing Ltd."
      label="Pay Now"
      billingAddress
      shippingAddress
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={onToken}
      stripeKey={publishableKey}
      closed = {handleClosed}
    />) : (
      <div className="payment-prompt">Please log in to proceed with payment!</div>
    )
  );
};

export default StripCheckoutButton;