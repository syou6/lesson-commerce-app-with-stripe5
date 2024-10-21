// import { NextResponse } from "next/server";
// import initStripe from "stripe";
// import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

// export async function GET(req: Request) {
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

//   const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

//   const session = await stripe.billingPortal.sessions.create({
//     customer: stripe_cutomer_data?.stripe_customer!,
//     return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
//   });

//   return NextResponse.json({ url: session.url }, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }


// import { NextRequest, NextResponse } from "next/server";
// import initStripe from "stripe";
// import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

// export async function GET(req: NextRequest) {
//   const headers = new Headers({
//     'Access-Control-Allow-Origin': 'https://lesson-commerce-app-with-stripe-5kb62d2vd-syou6s-projects.vercel.app',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     'Access-Control-Allow-Credentials': 'true',
//   });

//   if (req.method === 'OPTIONS') {
//     return new NextResponse(null, { status: 204, headers });
//   }

//   const supabase = supabaseRouteHandlerClient();
//   const { data, error } = await supabase.auth.getUser();

//   if (error || !data.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
//   }

//   const { data: stripe_customer_data } = await supabase
//     .from("profile")
//     .select("stripe_customer")
//     .eq("id", data.user.id)
//     .single();

//   const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

//   try {
//     const session = await stripe.billingPortal.sessions.create({
//       customer: stripe_customer_data?.stripe_customer!,
//       return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
//     });

//     return NextResponse.json({ url: session.url }, { headers });
//   } catch (error) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe";
import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

export async function GET(req: NextRequest) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': 'https://lesson-commerce-app-with-stripe-5kb62d2vd-syou6s-projects.vercel.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  });

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers });
  }

  const supabase = supabaseRouteHandlerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  const { data: stripe_customer_data } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", data.user.id)
    .single();

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_data?.stripe_customer!,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url }, { headers });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers });
  }
}
