"use client";

import { PaymentType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState(PaymentType.MONTHLY);
  const [paymentDate, setPaymentDate] = useState(new Date());

  const createPayment = api.payment.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setTitle("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPayment.mutate({ title, paymentDate, amount, paymentType });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.valueAsNumber)}
        className="w-full rounded-full px-4 py-2 text-black"
      />

      <input
        type="radio"
        name="paymentType" // Add a name to group the radio buttons
        value="YEARLY" // Assuming PaymentType is an enum and has a value of "YEARLY"
        checked={paymentType === "YEARLY"} // Check if the paymentType state matches this value
        onChange={(e) => setPaymentType(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <label>Yearly</label>

      <input
        type="radio"
        name="paymentType" // Same name as above to group the radio buttons
        value="MONTHLY" // Assuming PaymentType is an enum and has a value of "MONTHLY"
        checked={paymentType === "MONTHLY"} // Check if the paymentType state matches this value
        onChange={(e) => setPaymentType(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      
      <label>Monthly</label>
      <input
        type="date"
        placeholder="Payment Date"
        value={paymentDate.toISOString().split("T")[0]}
        onChange={(e) => setPaymentDate(new Date(e.target.value))}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPayment.isLoading}
      >
        {createPayment.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
