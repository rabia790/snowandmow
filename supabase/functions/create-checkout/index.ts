import { serve } from 'https://deno.land/std/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.1.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (Allows your React app to talk to this function)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Get Job Data from Frontend
    const { jobId, price, serviceName, successUrl, cancelUrl } = await req.json()

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents ($10 = 1000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Pass the Job ID back in the URL so we know which job was paid
      success_url: `${successUrl}?job_id=${jobId}&payment_success=true`,
      cancel_url: cancelUrl,
    })

    // 4. Return the Checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      },
    )
  }
})