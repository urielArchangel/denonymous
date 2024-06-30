// File: context/StripeContext.tsx

import React, { createContext, useState, ReactNode } from "react";
import { useRouter } from "next/router";

// Define the shape of the context
interface StripeContextType {
  clientSecret: string;
  handlePaymentIntent: (amount: number) => void;
  handleCancel: () => void;
  error: string | null;
  display: boolean | null;
}

// Default values for the context
const defaultContext: StripeContextType = {
  clientSecret: "",
  handlePaymentIntent: () => {},
  handleCancel: () => {},
  error: null,
  display: null,
};

// Create the context
export const StripeContext = createContext<StripeContextType>(defaultContext);

// Props type for the provider
interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [display, setDisplay] = useState<boolean | null>(null);

  // Handle the creation of payment intent
  const handlePaymentIntent = async (amount: number) => {
    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { client_secret: newClientSecret } = data;

      setClientSecret(newClientSecret);
      setDisplay(true);
    } catch (error) {
      setError("Failed to initiate payment. Please try again later.");
      console.error("Error creating payment intent:", error);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    setClientSecret("");
    setError(null);
  };

  // Render the context provider with the defined value
  return (
    <StripeContext.Provider
      value={{
        clientSecret,
        handlePaymentIntent,
        handleCancel,
        error,
        display,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
};
