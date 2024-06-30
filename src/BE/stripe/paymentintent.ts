import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Use environment variable for the API key
const stripe = new Stripe(process.env.stripeSecretKey!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { amount } = await req.json();

    // Validate the amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "USD",
    });

    // Return the response
    return NextResponse.json({
      msg: "Payment intent created",
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
