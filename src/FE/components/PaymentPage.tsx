// File: components/Checkout.tsx

import React, { useContext, useState } from "react";
import { StripeContext } from "./contexts/StripeContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./Checkout";

// Ensure process.env variable is typed and checked
const stripePublicKey = process.env.stripePublickey!;
if (!stripePublicKey) {
  throw new Error("Stripe public key must be set in environment variables.");
}

const stripePromise = loadStripe(stripePublicKey);

const Checkout: React.FC = () => {
  // Fetch context values with proper type assertion
  const { handlePaymentIntent, error, clientSecret, display, handleCancel } =
    useContext(StripeContext);

  // State for amount input and display toggle
  const [amount, setAmount] = useState<number>(0);
  const [show, setShow] = useState<any>(display);

  // Function to initiate payment
  const initiatePayment = () => {
    if (amount > 0) {
      handlePaymentIntent(amount);
    }
  };

  // Options for Stripe Elements
  const options = {
    clientSecret,
  };

  // Click handler for cancel button
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleCancel();
    setShow(false);
  };

  return (
    <div>
      {/* Conditional rendering for the payment form */}
      {show ? (
        <div className="h-screen flex justify-center items-center">
          <div className="w-full p-5 sm:w-[60%] mx-auto bg-white text-black">
            {/* Stripe Elements component */}
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm clientSecret={clientSecret} onClick={handleClick} />
            </Elements>
            {/* Cancel button */}
            <div className="text-center">
              <button
                onClick={handleClick}
                className="bg-[#0096D6] border-2 border-[#0096D6] text-white font-semibold w-[200px] text-center rounded p-2.5 ml-0 sm:ml-5 mx-auto"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Input for amount */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Enter amount"
        className="border p-2"
      />

      {/* Button to initiate payment */}
      <button
        onClick={initiatePayment}
        className="bg-green-500 text-white p-2 rounded ml-2"
      >
        Pay
      </button>
    </div>
  );
};

export default Checkout;
