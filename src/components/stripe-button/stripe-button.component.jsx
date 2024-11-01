import React from "react";
import StripeCheckout from "react-stripe-checkout";

const StripCheckoutButton = ({ price }) => {
  const priceForStripe = price * 100; //Stripe always takes price in cents
  const publishableKey =
    "pk_test_51QG9CSLb8tcdctYnCoPPKuccNrKERFJKXzz1axm7zGqR6NSZUvB0vd408Rkddo1q4oOhk5Ir7SXXSXeIivfAW87e00kr2mpzke";

  const onToken = (token) => {
    console.log(token);
    alert("Payment Successful!");
  };

  return (
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
    />
  );
};

export default StripCheckoutButton;