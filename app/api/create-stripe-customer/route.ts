// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { NextRequest, NextResponse } from "next/server";
// import initiStripe from "stripe";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//     const supabase = createRouteHandlerClient({ cookies });
//     const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET");
//     if (query !== process.env.API_ROUTE_SECRET) {
//         return NextResponse.json({
//             message: "APIを叩く権限がありません。",
//         });
//     }



// const data = await req.json();
// const {id,  email } = data.record;


//     const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
//     try {
//         const customer = await stripe.customers.create({
//             email,
//         });

//         const { error: supabaseError } = await supabase
//         .from("profile")
//         .update({
//             stripe_customer: customer.id,
//         })
//         .eq("id", id);

//         if (supabaseError) {
//             console.error('Supabaseエラー:', supabaseError);
//             return NextResponse.json({
//                 message: "Supabaseの更新中にエラーが発生しました。",
//             }, { status: 500 });
//         }
        
//         return NextResponse.json({
//             message: `stripe customer created: ${customer.id}`,
//         });
//     } catch (error) {
//         console.error('Stripe顧客作成エラー:', error);
//         return NextResponse.json({ error: 'Stripe顧客の作成中にエラーが発生しました' }, { status: 500 });
//     }
// }



import { NextRequest, NextResponse } from "next/server";
import initiStripe from "stripe";
import { supabaseRouteHandlerClient } from "@/utils/supabaseRouteHandlerClient";

export async function POST(req: NextRequest) {
  const supabase = supabaseRouteHandlerClient();

  const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET");
  if (query !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({
      message: "APIを叩く権限がありません。",
    });
  }

  const data = await req.json();

  const { id, email } = data.record;

  const stripe = new initiStripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  });

  const { error } = await supabase
    .from("profile")
    .update({
      stripe_customer: customer.id,
    })
    .eq("id", id);

  if (error) {
    console.error('Supabaseエラー:', error);
    return NextResponse.json({
      message: "Supabaseの更新中にエラーが発生しました。",
    }, { status: 500 });
  }

  return NextResponse.json({
    message: `stripe customer created: ${customer.id}`,
  });
}
