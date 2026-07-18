"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onCancel: () => Promise<any>;
};

export default function CancelSubscriptionButton({ onCancel }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your premium tier? Your tracking resolution limits will drop immediately."
    );
    if (!confirmed) return;

    startTransition(async () => {
      await onCancel();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs font-semibold bg-sky-100/40 hover:bg-sky-100/70 text-zinc-900 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-300/30 dark:border-zinc-700/50 px-3.5 py-2 rounded-lg transition duration-150 shadow-sm cursor-pointer shrink-0 disabled:opacity-50"
    >
      {isPending ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
}
