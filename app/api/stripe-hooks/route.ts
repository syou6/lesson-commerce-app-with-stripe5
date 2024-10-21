export const dynamic = 'force-dynamic'

import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({cookies});
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

  const reqBuffer = Buffer.from(await req.arrayBuffer());


  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature!,
      endpointSecret!
    );

    console.log(event);

    switch (event.type) {
        case "customer.subscription.created":
            const customerSubscriptionCreated = event.data.object;
          await supabase
            .from("profile")
            .update({
              is_subscribed: true,
              interval: customerSubscriptionCreated.items.data[0].plan.interval,
            })
            .eq("stripe_customer", event.data.object.customer);
          break;
    case "customer.subscription.updated":
        const customerSubscriptionUpdated = event.data.object;

        if (customerSubscriptionUpdated.status === "canceled") {
            await supabase
            .from("profile")
            .update({
              is_subscribed: false,
              interval: null,
            })
            .eq("stripe_customer", event.data.object.customer);
             break;
        } else {
            await supabase
            .from("profile")
            .update({
              is_subscribed: true,
              interval: customerSubscriptionUpdated.items.data[0].plan.interval,
            })
            .eq("stripe_customer", event.data.object.customer);
            break;
        }


    case "customer.subscription.deleted":
        await supabase
        .from("profile")
        .update({
          is_subscribed: false,
          interval: null,
        })
        .eq("stripe_customer", event.data.object.customer);
         break;
        }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(`Webhook Error: ${error.message}`, { status: 400 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json('Internal Server Error', { status: 500 });
    }
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import initStripe from "stripe";
// import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

// export async function POST(req: NextRequest) {
//   const supabase = supabaseRouteHandlerClient();
//   const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
//   const signature = req.headers.get("stripe-signature");
//   const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

//   const reqBuffer = Buffer.from(await req.arrayBuffer());

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       reqBuffer,
//       signature!,
//       endpointSecret!
//     );

//     console.log(event);
//     // Handle the event
//     switch (event.type) {
//       case "customer.subscription.created":
//         const customerSubscriptionCreated = event.data.object;
//         await supabase
//           .from("profile")
//           .update({
//             is_subscribed: true,
//             interval: customerSubscriptionCreated.items.data[0].plan.interval,
//           })
//           .eq("stripe_customer", event.data.object.customer);
//         break;
//       case "customer.subscription.updated":
//         const customerSubscriptionUpdated = event.data.object;

//         if (customerSubscriptionUpdated.status === "canceled") {
//           await supabase
//             .from("profile")
//             .update({
//               is_subscribed: false,
//               interval: null,
//             })
//             .eq("stripe_customer", event.data.object.customer);
//           break;
//         } else {
//           await supabase
//             .from("profile")
//             .update({
//               is_subscribed: true,
//               interval: customerSubscriptionUpdated.items.data[0].plan.interval,
//             })
//             .eq("stripe_customer", event.data.object.customer);
//           break;
//         }
//       case "customer.subscription.deleted":
//         await supabase
//           .from("profile")
//           .update({
//             is_subscribed: false,
//             interval: null,
//           })
//           .eq("stripe_customer", event.data.object.customer);
//         break;
//     }

//     return NextResponse.json({ received: true });
//   } catch (err: any) {
//     return NextResponse.json(`Webhook Error: ${err.message}`, { status: 401 });
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import initStripe from "stripe";
// import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { priceId: string } }
// ) {
//   const supabase = supabaseRouteHandlerClient();
//   const { data } = await supabase.auth.getUser();
//   const user = data.user;

//   if (!user) {
//     return NextResponse.json("Unauthorized", { status: 401 });
//   }

//   const { data: stripe_cutomer_data } = await supabase
//     .from("profile")
//     .select("stripe_customer")
//     .eq("id", user?.id)
//     .single();

//   const priceId = params.priceId;

//   const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

//   const session = await stripe.checkout.sessions.create({
//     customer: stripe_cutomer_data?.stripe_customer!,
//     mode: "subscription",
//     payment_method_types: ["card"],
//     line_items: [{ price: priceId, quantity: 1 }],
//     success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
//     cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
//   });

//   return NextResponse.json({ id: session.id });
// }