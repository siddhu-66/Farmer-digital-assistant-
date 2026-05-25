import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

/**
 * Create a Payment Intent for Escrow
 */
export async function createEscrowPayment(amount: number, farmerId: string, contractId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: { farmerId, contractId, type: 'escrow_deposit' },
      // In a real app, you'd use Stripe Connect for automated payouts
      capture_method: 'manual', // Hold funds until harvest/verification
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe Error:', error);
    throw error;
  }
}

/**
 * Release Escrow Funds to Farmer
 */
export async function releasePayment(paymentIntentId: string) {
  return await stripe.paymentIntents.capture(paymentIntentId);
}
