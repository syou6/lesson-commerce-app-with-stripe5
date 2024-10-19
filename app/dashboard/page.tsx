import { Database } from '@/lib/database.types';
import { createServerComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from "next/headers";
import SubscriptionManagementButton from '@/components/checkout/SubscriptionManagementButton';

export const dynamic = 'force-dynamic'

const getProfileDate = async (supabase: SupabaseClient<Database>) => {
    const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();
    return profile;
};

const Dashboard = async() => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const profile = await getProfileDate(supabase);

  return (
    <div className='w-full max-w-3xl mx-auto py-16 px-8'>
        <h1 className='text-3xl mb-6'>ユーザー管理ダッシュボード</h1>
        <div>
            <div className='mb-3'>
                {profile && profile.is_subscribed
                ? `プラン契約中: ${profile.interval}`
                : "プラン未加入"}
            </div>
            <SubscriptionManagementButton />
        </div>
        </div>
  )
}


export default Dashboard
