


"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SubscriptionManagementButton = () => {
  const router = useRouter();

  const loadPortal = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/portal`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load portal');
      }

      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      console.error('Error loading portal:', error);
      // エラーメッセージを表示するなどの処理を追加
    }
  };

  return (
    <div>
      <Button onClick={loadPortal}>サブスクリプション管理</Button>
    </div>
  );
};

export default SubscriptionManagementButton;
