"use client";

import dynamic from 'next/dynamic';

const AiLoanAdvisor = dynamic(() => import('./AiLoanAdvisor'), {
  ssr: false,
});

export default function ClientChatWrapper() {
  return <AiLoanAdvisor />;
}
