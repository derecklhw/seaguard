import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeApiKey, {
  apiVersion: '2022-11-15',
});

const YOUR_DOMAIN = 'http://localhost:8000'; 

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
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
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
