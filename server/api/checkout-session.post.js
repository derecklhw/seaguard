import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeApiKey, {
  apiVersion: '2022-11-15',
});

const currentDomain = config.public.redirectUri; 

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const session = await stripe.checkout.sessions.create({
      submit_type: 'donate',
      line_items: [
        {
          price: body.Id, 
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${currentDomain}donation`,
      cancel_url: `${currentDomain}donation`,
    });

    return {
      url: session.url,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
