"use client";

import { useRouter } from "next/navigation";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function FlowCompletePage() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer bg-white"
      onClick={() => router.push("/")}
    >
      <img
        src={`${BASE_PATH}/images/flow_clear.gif`}
        alt="업무 완수"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
