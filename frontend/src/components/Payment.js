import { loadStripe } from "@stripe/stripe-js";

export default function Payment() {
  const stripePromise = loadStripe("your_test_publishable_key");

  const handlePay = async () => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      lineItems: [{ price: "price_testid", quantity: 1 }],
      mode: "payment",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
    });
  };

  return <button onClick={handlePay}>Pay with Stripe</button>;
}
