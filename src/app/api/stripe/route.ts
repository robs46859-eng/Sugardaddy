import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the checkout session completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    // We expect to pass our StripePackage ID in the client_reference_id
    // or metadata when we create the payment link/session.
    const packageId = session.client_reference_id;

    if (packageId) {
      try {
        await prisma.stripePackage.update({
          where: { id: packageId },
          data: { status: 'paid' },
        });
        console.log(`Successfully marked package ${packageId} as paid.`);
      } catch (err) {
        console.error('Database update failed:', err);
        return new NextResponse('Database update failed', { status: 500 });
      }
    }
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
}
